import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/ui/general/app.service';
import { UpdatePreamble } from 'src/app//modifiers/publish-options-modifiers/update-preamble';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { AuthService } from 'src/app/services/app/auth.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-publish-preamble',
    templateUrl: './publish-preamble.component.html',
    styleUrls: ['./publish-preamble.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishPreambleComponent implements OnInit {
    public puzzle = null;
    public form: FormGroup;
    public appStatus: AppStatus;
    public sample: Clue[];
    public today = new Date();
    public appSettings: AppSettings;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private authService: AuthService,
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder,
        private detRef: ChangeDetectorRef,) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        
        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;
            this.detRef.detectChanges();
        }));
        this.subs.push(this.appSettingsService.observe().subscribe(settings => {
            this.appSettings = settings;
            this.detRef.detectChanges();
        }));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {


            this.form = this.formBuilder.group({
                title: [""],
                header: { ops: [] },
                body: { ops: [] }
            });

            this.subs.push(this.form.valueChanges.subscribe(() => {
                this.detRef.detectChanges();
            }));

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        if (puzzle) {
                            // this.header = puzzle.notes.header;
                            this.sample = this.puzzle.clues.filter((c, i) => i < 3);
                            this.form.patchValue(puzzle.notes);
                            this.form.patchValue({ title: puzzle.info.title});
                        }
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.activePuzzle.updateAndCommit(new UpdatePreamble(
            this.form.value.title,
            this.form.value.header,
            this.form.value.body));

        if (this.appSettings.traceOutput) {
            this.navService.navigate("preview");
        } else if (this.authService.getCredentials().authenticated) {
            this.navService.navigate("continue");
        } else {
            this.navService.navigate("authenticate");
        }
    }

    public onBack() {
        this.activePuzzle.updateAndCommit(new UpdatePreamble(
            this.form.value.title,
            this.form.value.header,
            this.form.value.body));
            
            this.navService.navigate("back");
    }

    public onPreview() {
        this.activePuzzle.updateAndCommit(new UpdatePreamble(
            this.form.value.title,
            this.form.value.header,
            this.form.value.body));
            
            this.navService.navigate("preview");
    }

    public getUsername(): string {
        return this.appSettings && this.appSettings.username ? 
            this.appSettings.username : 
            "Somebody"; 
    }
}