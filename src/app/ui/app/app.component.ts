import { Component, OnInit, OnDestroy } from '@angular/core';

import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';
import { Alert } from '../common';
import { AppService, AppStatus } from 'src/app/services/app.service';
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

        this.solvePuzzle(this.httpPuzzleService, provider);
    }

    public solvePuzzle(service: any, provider: string) {
        service.getPuzzle(provider)
            .then((puzzle) => {
                this.appService.clearBusy();
                this.puzzleService.usePuzzle(puzzle);
                this.router.navigate(["/solver"])
            })
            .catch((error) => {
                this.appService.clearBusy();
                this.appService.setAlert("danger", JSON.stringify(error));
            }
        );
    }
}

