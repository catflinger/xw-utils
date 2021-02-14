import { Component, OnInit, ViewChild } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { combineLatest, from, range, Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { ClearShading } from 'src/app//modifiers/grid-modifiers/clear-shading';
import { DownloadInstance } from '../../general/download-button/download-button.component';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { GridComponent } from '../../grid/grid/grid.component';
import { groupBy, map, mergeMap, reduce, tap } from 'rxjs/operators';
import { Grid } from 'src/app/model/puzzle-model/grid';


interface PangramLetter {
    letter: string,
    count: number,
}

@Component({
  selector: 'app-nina-finder',
  templateUrl: './nina-finder.component.html',
  styleUrls: ['./nina-finder.component.css']
})
export class NinaFinderComponent implements OnInit {
    private subs: Subscription[] = [];

    public puzzle: Puzzle = null;
    public barred: boolean = false;

    public pangramCounter: PangramLetter[] = [];

    public mainDiagonal: string = "";
    public otherDiagonal: string = "";
    public mainDiagonalReverse: string = "";
    public otherDiagonalReverse: string = "";

    public perimiter: string = "";

    public uncheckedRows: string[] = [];
    public uncheckedColumns: string[] = [];
    public uncheckedRowsR: string[] = [];
    public uncheckedColumnsR: string[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle, 
    ) {
        this.clearPangramCounter();
    }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe()
                .subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;

                        if (!puzzle){
                            // skip over this
                        } else if (!puzzle.grid){
                            this.appService.setAlertError("This puzzle does not have a grid", null);
                        } else {
                            this.barred = puzzle.grid.properties.style === "barred";
                            this.countLetters(puzzle.grid);
                            this.extractDiagonals(puzzle.grid);
                            this.getExtractPerimiter(puzzle.grid);
                            this.extractUncheckedRows(puzzle.grid);
                            this.extractUncheckedColumns(puzzle.grid);
                        }
                    }
            ));
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCellClick(cell: GridCell) {
        this.appService.clear();
    }

    public onBack() {
        this.appService.clear();
        this.navService.navigate("back");
    }

    private clearPangramCounter() {
        this.pangramCounter = [];

        range(0, 25)
        .subscribe(offset => this.pangramCounter.push({
            letter: String.fromCharCode("A".charCodeAt(0) + offset),
            count: 0
        }));

    }

    private countLetters(grid: Grid) {
        this.clearPangramCounter();

        grid.cells.forEach(cell => {
            let entry = this.pangramCounter.find(pl => pl.letter.toUpperCase() === cell.content);
            if (entry) {
                entry.count++;
            }
        });
    }

    private extractDiagonals(grid: Grid) {
        const diagLength = Math.min(grid.properties.size.across, grid.properties.size.down);
        this.mainDiagonal = "";
        this.otherDiagonal = "";

        range(0, diagLength)
        .pipe(
            map(offset => [
                grid.cellAt(offset, offset).content,
                grid.cellAt(offset, diagLength - 1 - offset).content
            ]),
            reduce(
                (acc: {main: string, other: string}, letters: string[]) => {
                    return {
                        main: acc.main += letters[0],
                        other: acc.other += letters[1]
                    };
                },
                { main: "", other: "" }
            )
        )
        .subscribe(diags => {
            this.mainDiagonal = diags.main;
            this.otherDiagonal = diags.other;
            this.mainDiagonalReverse = this.mainDiagonal.split("").reverse().join("");
            this.otherDiagonalReverse = this.otherDiagonal.split("").reverse().join("");
        })
    }

    private extractUncheckedRows(grid: Grid) {
        this.uncheckedRows = [];
        const down = grid.properties.size.down;
        
        for(let y: number = 0; y < down; y++) {
            let checkedCell = grid.cells.find(cell => cell.y === y && cell.label);
            if (!checkedCell) {
                let str = grid.cells
                .filter(cell => cell.y === y)
                .map(cell => cell.content)
                .join("");

                this.uncheckedRows.push(str);
                this.uncheckedRowsR.push(str.split("").reverse().join(""));
            }
        }

    }

    private extractUncheckedColumns(grid: Grid) {
        this.uncheckedColumns = [];
        const across = grid.properties.size.across;
        
        for(let x: number = 0; x < across; x++) {
            let checkedCell = grid.cells.find(cell => cell.x === x && cell.label);
            if (!checkedCell) {
                let str = grid.cells
                .filter(cell => cell.x === x)
                .map(cell => cell.content)
                .join("");

                this.uncheckedColumns.push(str);
                this.uncheckedColumnsR.push(str.split("").reverse().join(""));
            }
        }

    }

    private getExtractPerimiter(grid: Grid) {
        this.perimiter = "";
        const across = grid.properties.size.across;
        const down = grid.properties.size.down;

        for(let x: number = 0; x < across; x++) {
            this.perimiter += grid.cellAt(x, 0).content;
        }

        for(let y: number = 0; y < down; y++) {
            this.perimiter += grid.cellAt(across - 1, y).content;
        }

        for(let x: number = across - 1; x >= 0; x--) {
            this.perimiter += grid.cellAt(x, down - 1).content;
        }

        for(let y: number = down - 1; y >= 0; y--) {
            this.perimiter += grid.cellAt(0, y).content;
        }

    }
}
