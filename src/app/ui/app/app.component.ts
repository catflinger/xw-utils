import { Component, OnInit, OnDestroy } from '@angular/core';

import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';
import { Alert } from '../common';
import { AppService, AppStatus, EditorType } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;

    private subs: Subscription[] = [];

    constructor(
        private puzzleService: PuzzleService,
        private appService: AppService,
        private httpPuzzleService: HttpPuzzleSourceService,
        private router: Router) {
    }

    public ngOnInit() {
        this.appService.clearBusy();
        this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus);
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSolve(provider: string) {
        this.appService.clearAlerts();
        this.appService.setBusy();

        // TO DO: warn before clearing current puzzle
        this.puzzleService.usePuzzle(null);

        this.httpPuzzleService.getPuzzle(provider)
        .then((puzzle) => {
            this.appService.clearBusy();
            this.puzzleService.usePuzzle(puzzle);
            let editor: EditorType = puzzle.solveable ? "solver" : "blogger";
            this.appService.setEditor(editor);
            this.router.navigate(["/", editor])
        })
        .catch((error) => {
            this.appService.clearBusy();
            this.appService.setAlert("danger", error.toString());
        });
    }
}

