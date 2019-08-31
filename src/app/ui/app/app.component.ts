import { Component, OnInit } from '@angular/core';

import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';
import { Alert } from '../common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public alerts: Alert[] = [];

    constructor(
        private puzzleService: PuzzleService,
        private httpPuzzleService: HttpPuzzleSourceService,
        private router: Router) {
    }

    public ngOnInit() {
    }

    public onSolve(provider: string) {
        this.clearAlerts();
        // TO DO: warn before clearing current puzzle
        this.puzzleService.usePuzzle(null);

        this.solvePuzzle(this.httpPuzzleService, provider);
    }

    public solvePuzzle(service: any, provider: string) {
        service.getPuzzle(provider)
            .then((puzzle) => {
                this.puzzleService.usePuzzle(puzzle);
                this.router.navigate(["/solver"])
            })
            .catch((error) => this.alerts.push(new Alert("danger", JSON.stringify(error))));
    }

    public clearAlerts() {
        while (this.alerts.length) {
            this.alerts.pop();
        }
    }
}
