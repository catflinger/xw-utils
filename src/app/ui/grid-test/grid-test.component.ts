import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';


@Component({
    selector: 'app-grid-test',
    templateUrl: './grid-test.component.html',
    styleUrls: ['./grid-test.component.css']
})
export class GridTestComponent {

    constructor(private puzzleService: PuzzleService) {
    }

    public OnLoad(){
        this.puzzleService.loadPuzzle("abc");
    }

    public OnClear(){
        this.puzzleService.clearPuzzles();
    }

}
