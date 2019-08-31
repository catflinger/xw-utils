import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { DevelopmentPuzzleSourceService } from 'src/app/services/development-puzzle-source.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';


@Component({
    selector: 'app-grid-test',
    templateUrl: './grid-test.component.html',
    styleUrls: ['./grid-test.component.css']
})
export class GridTestComponent {

    public errorMessage: string = "";

    constructor(
        private puzzleService: PuzzleService,
        private httpPuzzleService: HttpPuzzleSourceService,
        private devPuzzleService: DevelopmentPuzzleSourceService,
        private localStorageService: LocalStorageService) {
    }

    public onLoadTest(){
        this.errorMessage = "working...";

        this.devPuzzleService.getPuzzle()
        .then( (puzzle) => {
            this.errorMessage = "LOADED OK";
            return this.puzzleService.usePuzzle(puzzle)
         })
        .catch( (error) => this.errorMessage = error );
    }

    public onLoadHttp(provider: string){
        this.errorMessage = "working...";

        this.httpPuzzleService.getPuzzle(provider)
        .then( (puzzle) => {
            this.errorMessage = "LOADED OK";
            return this.puzzleService.usePuzzle(puzzle)
         })
        .catch( (error) => this.errorMessage = JSON.stringify(error) );
    }

    public onLoadLocal(){
        this.errorMessage = "working...";

        this.localStorageService.getPuzzle()
        .then( (puzzle) => {
            this.errorMessage = "LOADED OK";
            return this.puzzleService.usePuzzle(puzzle)
         })
        .catch( (error) => this.errorMessage = error );
    }

    public onClear(){
        this.localStorageService.clearPuzzles();
    }

}
