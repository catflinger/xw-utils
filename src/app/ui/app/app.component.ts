import { Component, OnInit } from '@angular/core';

import { PuzzleService } from 'src/app/services/puzzle.service';
import { HttpPuzzleService } from 'src/app/services/http-puzzle.service';
import { DevelopmentPuzzleSourceService } from 'src/app/services/development-puzzle-source.service';
import { LocalstoragePuzzleSourceService } from 'src/app/services/localstorage-puzzle-source.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public message: string = "";

    constructor(
        private puzzleService: PuzzleService,
        private httpPuzzleService: HttpPuzzleService,
        private devPuzzleService: DevelopmentPuzzleSourceService,
        private router: Router) {
    }

    public ngOnInit() {
    }

    public onSolve(provider: string) {
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
            .catch((error) => this.message = JSON.stringify(error));
    }
}
