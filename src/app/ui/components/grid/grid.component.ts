import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { GridParameters, GridOptions } from '../../common';
import { GridPainterService } from '../../services/grid-painter.service';

export type BarClickEvent = {cell: GridCell, bar: "rightBar" | "bottomBar" };
export type TextInputEvent = { text: string };

type GridInput = { 
    text: string,
    style: { 
        display: string,
        position: string, 
        top: string,
        left: string,
        height: string,
        width: string,
        border: string,
    }, 
}

const gridInputDefaults: GridInput = { 
    text: "", 
    style: {
        display: "none",
        position: "relative",
        top: "0px",
        left: "0px",
        height: "50px",
        width: "50px",
        border: "10px yellow solid",
    }
};

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

    @Input() options: GridOptions;
    @Output() cellClick = new EventEmitter<GridCell>();
    @Output() barClick = new EventEmitter<BarClickEvent>();
    @Output() textInput = new EventEmitter<TextInputEvent>();

    @ViewChild('gridCanvas', { static: false }) canvas: ElementRef;

    public canvasHeight: number = 0;
    public canvasWidth: number = 0;
    public puzzle: Puzzle;
    public source: string = "";
    public err: any;
    
    public input: GridInput = gridInputDefaults;

    private gridParams: GridParameters;
    private viewInitiated = false;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private gridPainter: GridPainterService) {
    }

    private xxxxxxxxxxxxxx(cell: GridCell) {
        const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
        const context = canvasEl.getContext('2d');

        let gridInfo = this.gridPainter.getGridInfo(context, this.puzzle.grid, this.options);
        let cellInfo = this.gridPainter.getCellInfo(context, this.puzzle.grid, this.options, cell.id);

        this.input.text = cell.content;
        this.input.style.top = cellInfo.top.toString() + cellInfo.unit;
        this.input.style.left = cellInfo.left.toString() + cellInfo.unit;
        this.input.style.height = cellInfo.height.toString() + cellInfo.unit;
        this.input.style.width = cellInfo.width.toString() + cellInfo.unit;
        this.input.style.display = "block";

    }

    public ngOnInit() {
        this.gridParams = new GridParameters();

        this.subs.push(
            this.activePuzzle.observe()
                .subscribe(
                    (puzzle) => {

                        if (puzzle) {
                            this.puzzle = puzzle;
                            this.canvasWidth = this.gridParams.cellSize * this.puzzle.grid.properties.size.across + this.gridParams.gridPadding * 2;
                            this.canvasHeight = this.gridParams.cellSize * this.puzzle.grid.properties.size.down + this.gridParams.gridPadding * 2;

                            this.input.style.display = "none";
                            let cell = this.puzzle.grid.cells.find(c => c.edit);

                            if (cell) {
                                this.xxxxxxxxxxxxxx(cell);
                            }

                            // don't draw the grid until the native canvas has had a chance to resize
                            setTimeout(() => this.drawGrid() , 0);

                        } else {
                        }
                    },
                    (err) => {
                        this.err = err;
                    }
                )
        );
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    ngAfterViewInit() {
        this.viewInitiated = true;
        this.drawGrid()
    }

    onCanvasClick(params: any) {
        const cellSize = this.gridParams.cellSize;
        const tolerance = cellSize / 5;

        const bounds = this.canvas.nativeElement.getBoundingClientRect();
        let xOffsetInGrid = params.clientX - bounds.left - this.gridParams.gridPadding;
        let yOffsetInGrid = params.clientY - bounds.top - this.gridParams.gridPadding;

        // i,j represent the cell number in the model eg 3 cells across and two cells down
        const i = Math.floor(xOffsetInGrid / cellSize);
        const j = Math.floor(yOffsetInGrid / cellSize);

        // x,y represent the offset (in pixels) of the mouse click from the top-left corner of cell i,j
        let x = xOffsetInGrid % cellSize;
        let y = yOffsetInGrid % cellSize;

        let cell: GridCell = this.puzzle.cellAt(i, j);
        if (cell) {
            // for all grids emit an event to say a cell has been clicked
            this.cellClick.emit(cell);

            // For barred grids emit the barClick event only if the click is on a bar area, these are areas
            // near to an edge of the cell but not in a corner. Edges that form the outside of the grid
            // cannot have bars and in these cases the barClick is not fired.
            if (x < tolerance && y < tolerance) {
                // in a corner, do nothing
            } else if (x < tolerance && cellSize - y < tolerance) {
                // in a corner, do nothing
            } else if (cellSize - x < tolerance && y < tolerance) {
                // in a corner, do nothing
            } else if (cellSize - x < tolerance && cellSize - y < tolerance) {
                // in a corner, do nothing
            } else if (i < this.puzzle.grid.properties.size.across - 1 && cellSize - x <= tolerance) {
                // click is near right edge
                this.barClick.emit({ cell, bar: "rightBar"});
            } else if (j < this.puzzle.grid.properties.size.down - 1 && cellSize - y <= tolerance) {
                // click is near bottom edge
                this.barClick.emit({ cell, bar: "bottomBar"});
            } else if (i > 0 && x < tolerance) {
                // click is near left edge of this cell, so right edge of previous cell
                this.barClick.emit({ cell: this.puzzle.cellAt(i - 1, j), bar: "rightBar"});
            } else if (j > 0 && y < tolerance) {
                // click is near top edge of this cell, so bottom edge of previous cell
                this.barClick.emit({ cell: this.puzzle.cellAt(i, j - 1), bar: "bottomBar"});
            }
        }
    }

    public onInput(event: KeyboardEvent) {
        if (event && 
            event.key && 
            typeof event.key === "string" &&
            event.key.length === 1 && 
            RegExp("[A-Z]", "i").test(event.key)) {

            this.textInput.emit({ text: event.key });
        }
        event.preventDefault();
    }

    private drawGrid(): void {
        if (this.viewInitiated && this.canvas) {
            const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
            const context = canvasEl.getContext('2d');
            this.gridPainter.drawGrid(context, this.puzzle.grid, this.options);
        }
    }
}
