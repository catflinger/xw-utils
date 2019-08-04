import { Component, OnInit } from '@angular/core';
import { PuzzleStoreService } from 'src/app/services/puzzle-store/puzzle-store.service';
import { Puzzle } from 'src/app/model/puzzle';

@Component({
    selector: 'app-grid-test',
    templateUrl: './grid-test.component.html',
    styleUrls: ['./grid-test.component.css']
})
export class GridTestComponent implements OnInit {
    public puzzle: Puzzle;
    public source: string = "";
    public err: any;

    constructor(private puzzleService: PuzzleStoreService) {
    }

    public ngOnInit() {
        this.puzzleService.getPuzzle()
        .then((puzzle) => {
            this.puzzle = puzzle;
            this.source = JSON.stringify(puzzle);
        })
        .catch((err) => { this.err = err; });
    }

}
