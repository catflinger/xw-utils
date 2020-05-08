import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { Subscription } from 'rxjs';
import { AuthService, Credentials } from 'src/app/services/app/auth.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleSummary } from 'src/app/model/interfaces';
import { BackupService } from 'src/app/services/storage/backup.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    public puzzleList: IPuzzleSummary[] = [];
    public gridList: IPuzzleSummary[] = [];
    private subs: Subscription[] = [];
    public appStatus: AppStatus;
    public credentials: Credentials;

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        private puzzleManagement: IPuzzleManager,
        private authService: AuthService,
        private backupService: BackupService,
    ) { }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
        this.subs.push(this.authService.observe().subscribe(credentials => this.credentials = credentials));

        this.subs.push(this.puzzleManagement.getPuzzleList().subscribe(
            (list) => {
                this.puzzleList = list.filter(p => p.info.provider !== "grid")
                    .sort((a, b) => b.info.puzzleDate.getTime() - a.info.puzzleDate.getTime() );
                this.gridList = list.filter(p => p.info.provider === "grid")
                    .sort((a, b) => b.info.puzzleDate.getTime() - a.info.puzzleDate.getTime() );
            },
            (error) => this.appService.setAlert("danger", error.toString())
        ));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onOpenSaved(id: string) {

        this.puzzleManagement.openPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {

                // TO DO: see if the puzzle has parse errors and route accordingly
                switch (puzzle.info.provider) {
                    // case "grid":
                    //     this.navService.beginTrack("createGridTrack", new AppTrackData(), "edit-grid");
                    //     break;
                    case "text":
                        if (puzzle.capability.ready) {
                            this.navService.beginTrack("solveTrack", {});
                        } else {
                            this.navService.beginTrack("createTextTrack", {}, "parser");
                        }
                        break;
                    case "grid-text":
                        if (puzzle.capability.ready) {
                            this.navService.beginTrack("solveTrack", {});
                        } else {
                            this.navService.beginTrack("createGridAndTextTrack", {}, "edit-grid");
                        }
                        break;
                    case "pdf":
                        if (puzzle.capability.ready) {
                            this.navService.beginTrack("solveTrack", {});
                        } else {
                            this.navService.beginTrack("createPdfTrack", {}, "parser");
                        }
                        break;
                    default:
                        // TO DO: think about what happens to a downlaoded puzzle that fails to parse
                        this.navService.beginTrack("solveTrack", {});
                        break;
                }

            }
        });
    }

    public onOpenSavedGrid(id: string) {
        this.puzzleManagement.openPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {
                this.navService.beginTrack("createGridTrack", {}, "edit-grid");
            }
        });
    }

    public onDelete(id: string) {
        this.puzzleManagement.deletePuzzle(id);
    }

    public onBackup(id: string) {
        this.backupService.backupPuzzle(id)
        .then(() => console.log("done"))
        .catch(() => console.log("failed"));
    }
}
