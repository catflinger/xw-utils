import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, GridCell, Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { PuzzleService } from 'src/app/services/puzzle.service';

class GridParameters {
    public readonly cellSize = 33;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly gridColor = "#000000";
    public readonly highlightColor = "BurlyWood";
}

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

    @ViewChild('gridCanvas', { static: false }) canvas: ElementRef;

    private gridParams: GridParameters;

    public canvasHeight: number = 0;
    public canvasWidth: number = 0;

    public puzzle: Puzzle;
    public source: string = "";
    public err: any;

    private subs: Subscription[] = [];

    constructor(private puzzleService: PuzzleService) {
    }

    public ngOnInit() {
        this.gridParams = new GridParameters();
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    ngAfterViewInit() {

        this.subs.push(
            this.puzzleService.getObservable()
                .subscribe(
                    (puzzle) => {

                        if (puzzle) {
                            this.puzzle = puzzle;

                            this.canvasWidth = this.gridParams.cellSize * this.puzzle.grid.size.across + this.gridParams.gridPadding * 2;
                            this.canvasHeight = this.gridParams.cellSize * this.puzzle.grid.size.down + this.gridParams.gridPadding * 2;

                            // TO DO: investigate change detection and Angular Lifecycle events more so we don't need set timeout here
                            // without setTimeout grid isn't getting drown.  Something to do with the canvas not being ready to draw on yet
                            setTimeout(() => this.drawGrid(), 0);

                        } else {
                        }
                    },
                    (err) => {
                        this.err = err;
                    }
                )
        );
    }

    onCanvasClick(params: any, cellId: string) {

        // TO DO: ignore mouse click on grid padding

        const bounds = this.canvas.nativeElement.getBoundingClientRect();
        let left = params.clientX - bounds.left - this.gridParams.gridPadding;
        let x = Math.floor(left / this.gridParams.cellSize);

        let top = params.clientY - bounds.top - this.gridParams.gridPadding;
        let y = Math.floor(top / this.gridParams.cellSize);

        this.puzzleService.selectClueByCell(x, y);

    }

    private drawGrid(): void {
        console.log("drawGrid");
        const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
        const context = canvasEl.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvasEl.width, canvasEl.height);

        context.translate(this.gridParams.gridPadding, this.gridParams.gridPadding);

        this.puzzle.grid.cells.forEach((cell) => {
            this.drawCell(context, cell);
        });
    }

    private drawCell(context: CanvasRenderingContext2D, cell: GridCell) {
        const top = cell.y * this.gridParams.cellSize;
        const left = cell.x * this.gridParams.cellSize;
        const size = this.gridParams.cellSize;

        // fill the cell
        if (!cell.light) {
            this.fillCell(context, left, top, this.gridParams.gridColor);
        } else {

            if (cell.highlight){
                this.fillCell(context, left, top, this.gridParams.highlightColor);
            }

            // TO DO: draw the caption 

            // TO DO: draw the cell text 
        }

        // draw top border for cells at the top of the grid
        if (cell.y === 0) {
            this.drawLine(
                context, 
                [left , top - 0.5], 
                [left + size, top - 0.5], 
                this.gridParams.borderWidth,
                this.gridParams.gridColor);
        }

        // draw left border for cells at the left of the grid
        if (cell.x === 0) {
            this.drawLine(
                context, 
                [left - 0.5, top], 
                [left - 0.5, top + size], 
                this.gridParams.borderWidth,
                this.gridParams.gridColor);
        }

        // draw right border for all cells
        this.drawLine(
            context, 
            [left + size - 0.5, top],
            [left + size - 0.5, top + size],
            cell.rightBar ? this.gridParams.barWidth : this.gridParams.borderWidth,
            this.gridParams.gridColor);

        // draw bottom border for all cells
        this.drawLine(
            context, 
            [left, top + size - 0.5],
            [left + size, top + size -0.5],
            cell.bottomBar ? this.gridParams.barWidth : this.gridParams.borderWidth,
            this.gridParams.gridColor);
    }

    private fillCell(context: CanvasRenderingContext2D, left: number, top: number, color: string) {
        context.beginPath();
        context.fillStyle = color;

        context.rect(
            left - 1 + this.gridParams.borderWidth, 
            top - 1 + this.gridParams.borderWidth, 
            this.gridParams.cellSize - this.gridParams.borderWidth * 2 + 1, 
            this.gridParams.cellSize - this.gridParams.borderWidth * 2 + 1);

        context.fill();
}

    private drawLine(context: CanvasRenderingContext2D, from: [number, number], to: [number, number], width: number, color: string) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(from[0], from[1]);
        context.lineTo(to[0], to[1]);
        context.stroke();
    }
}
