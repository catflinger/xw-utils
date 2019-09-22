import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, AppStatus, EditorType } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { ApiSymbols } from 'src/app/services/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;

    private subs: Subscription[] = [];

    constructor(
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
            this.appService.clearAlerts();
            this.router.navigate(["/", editor])
        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clearBusy();
                this.appService.setAlert("danger", "You need to be logged in to load a new puzzle");
            } else {
                this.appService.clearBusy();
                this.appService.setAlert("danger", error.toString());
            }
        });
    }
}

