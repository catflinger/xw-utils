import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, AppStatus, EditorType } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';
import { IPuzzleManager, IActivePuzzle } from 'src/app/services/puzzle-management/puzzle-management.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;

    private subs: Subscription[] = [];

    constructor(
        private puzzleService: IActivePuzzle,
        private puzzleManagementService: IPuzzleManager,
        private appService: AppService,
        private router: Router) {
    }

    public ngOnInit() {
        this.appService.clearBusy();
        this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;

        });

        setInterval
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSolve(provider: string) {
        this.appService.clearAlerts();
        this.appService.setBusy();

        // TO DO: warn before clearing current puzzle

        this.puzzleManagementService.openNewPuzzle(provider)
        .then((puzzle) => {
            let editor: EditorType = puzzle.solveable ? "solver" : "blogger";
            this.appService.setEditor(editor);

            this.appService.clearBusy();
            this.router.navigate(["/", editor])
        })
        .catch((error) => {
            this.appService.clearBusy();
            this.appService.setAlert("danger", error.toString());
        });
    }
}

