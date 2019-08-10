import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-test',
    templateUrl: './grid-test.component.html',
    styleUrls: ['./grid-test.component.css']
})
export class GridTestComponent {

    constructor(private puzzleService: PuzzleService) {
    }

    public OnClick(){
        this.puzzleService.loadPuzzle("abc");

    }
}
