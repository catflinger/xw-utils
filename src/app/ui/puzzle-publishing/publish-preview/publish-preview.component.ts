import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { AppSettings, ContentGenerator } from 'src/app/services/common';
import { ListLayout } from 'src/app/services/content-generator/list-layout';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService, AppStatus } from '../../general/app.service';

@Component({
    selector: 'app-publish-preview',
    templateUrl: './publish-preview.component.html',
    styleUrls: ['./publish-preview.component.css']
})
export class PublishPreviewComponent implements OnInit {

    public puzzle = null;
    public appStatus: AppStatus;
    public appSettings: AppSettings;
    public debugContent: string = "";

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private authService: AuthService,
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private listLayout: ListLayout,
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

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        this.debugContent = this.listLayout.getContent(puzzle, "http://aplace/aresource");
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onClose() {
        this.navService.navigate("continue");
    }

}
