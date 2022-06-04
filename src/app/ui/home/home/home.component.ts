import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { Subscription, combineLatest } from 'rxjs';
import { AuthService, Credentials } from 'src/app/services/app/auth.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleSummary } from 'src/app/model/interfaces';
import { BackupService } from 'src/app/services/storage/backup.service';
import { UpdateInfo } from 'src/app/modifiers/puzzle-modifiers/update-info';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
    public puzzleList: IPuzzleSummary[] = [];
    public gridList: IPuzzleSummary[] = [];
    private subs: Subscription[] = [];
    public appStatus: AppStatus;
    public credentials: Credentials;
    public settings: AppSettings;
    public trace: any = null;

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        private puzzleManagement: IPuzzleManager,
        private authService: AuthService,
        private settingsService: AppSettingsService,
        private localStotage: LocalStorageService,
        private changeRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.subs.push(combineLatest(
            this.appService.getObservable(),
            this.authService.observe(),
            this.puzzleManagement.observePuzzleList(),
            this.settingsService.observe())
            .subscribe(
                result => {
                    this.appStatus = result[0];
                    this.credentials = result[1];
                    const list = result[2];
                    this.settings = result[3];
            
                    this.puzzleList = list.filter(p => p.info.provider !== "grid")
                        .sort((a, b) => b.info.puzzleDate.getTime() - a.info.puzzleDate.getTime() );
                    this.gridList = list.filter(p => p.info.provider === "grid")
                        .sort((a, b) => b.info.puzzleDate.getTime() - a.info.puzzleDate.getTime() );
                    this.changeRef.detectChanges();
                },
                error => {
                    this.appService.setAlert("danger", error.toString()); 
                    this.changeRef.detectChanges();
                }
            )
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onOpenSaved(id: string) {
        this.appService.clear();

        this.puzzleManagement.openPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {
                if (puzzle.ready) {
                    this.navService.beginTrack("solveTrack", {});
                } else {
                    this.navService.beginTrack("createPuzzleTrack", {}, "hub");
                }
                this.changeRef.detectChanges();
            }
        })
        .catch(error => this.appService.setAlertError(`Failed to open puzzle.`, error));
    }

    public onOpenSavedGrid(id: string) {
        this.appService.clear();
        this.puzzleManagement.openPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {
                this.navService.beginTrack("gridToolTrack", {}, "edit");
            }
            this.changeRef.detectChanges();
        });
    }

    public onDelete(id: string) {
        this.appService.clear();
        this.puzzleManagement.deletePuzzle(id);
    }

    public onEdit(id: string) {
        this.appService.clear();
        this.puzzleManagement.openPuzzle(id, [new UpdateInfo({ready: false})])
        .then(() => {
            this.navService.beginTrack("createPuzzleTrack", {}, "hub");
            this.changeRef.detectChanges();
        });
    }

    public onPreview(id: string) {
        this.appService.clear();
        this.puzzleManagement.openPuzzle(id)
        .then(() => {
            this.navService.beginTrack("publishPostTrack", {}, "publish-preview");
            this.changeRef.detectChanges();
        });
    }

    public onTrace(item: IPuzzleSummary) {
        try {
            if (this.settings.traceOutput) {
                this.trace = this.localStotage.getPuzzleRaw(item.info.id);
            }
        } catch {}
    }
}
