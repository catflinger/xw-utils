import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription, combineLatest } from 'rxjs';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPuzzleSummary } from 'src/app/model/interfaces';
import * as Bowser from "bowser";
import { AuthService } from 'src/app/services/app/auth.service';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { AppService } from '../../general/app.service';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    //private puzzleId: string;

    public puzzles: IPuzzleSummary[] = [];
    public form: FormGroup;
    
    constructor(
        private appService: AppService,
        private backupService: BackupService,
        private puzzleManager: IPuzzleManager,
        private authService: AuthService,
        private navService: NavService<AppTrackData>,
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit(): void {

        if (!this.authService.getCredentials().authenticated) {
            this.navService.goHome();
        }

        const browser = Bowser.getParser(window.navigator.userAgent);

        this.form = this.formBuilder.group({
            puzzle: [null, Validators.required],
            caption: ["", Validators.required],
            browser: [browser.getBrowserName(), Validators.required],
            computer: ["", Validators.required],
        });

        this.subs.push(
            this.puzzleManager.observePuzzleList().subscribe(puzzles => {
                this.puzzles = puzzles;
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onBackup() {
        this.appService.setBusy();
        this.appService.clearAlerts();

        const origin = this.form.value.browser + " on " + this.form.value.computer;
        
        this.backupService.backupPuzzle(
            this.form.value.puzzle.info.id, 
            origin, 
            this.form.value.caption)
        .then(() => {
            this.appService.clearBusy();
            this.navService.gotoRoute(["backups"]);
        })
        .catch((error) => {
            this.appService.clearBusy();
            this.appService.setAlert("danger", "Failed to complete backup: " + error)
        });
    }

    public onPuzzleChange() {
        this.form.patchValue({ caption: this.form.value.puzzle.info.title});
    }

    public onCancel() {
        this.navService.goHome();
    }
}
