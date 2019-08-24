import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalstoragePuzzleSourceService } from 'src/app/services/localstorage-puzzle-source.service';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private puzzleService: PuzzleService,
        private localPuzzleService: LocalstoragePuzzleSourceService ) {
    }

    ngOnInit() {
    }

    public onOpenCurrent() {
        this.localPuzzleService.getPuzzle()
        .then(puzzle => {
            if (puzzle) {
                this.puzzleService.usePuzzle(puzzle);
                this.router.navigate(["/solver"]);
            }
        });
    }
}
