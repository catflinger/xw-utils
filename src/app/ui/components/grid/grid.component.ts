import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { GridParameters, GridOptions } from '../../common';
import { GridPainterService } from '../../services/grid-painter.service';

export type BarClickEventParameter = {cell: GridCell, bar: "rightBar" | "bottomBar" };

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
    @Input() options: GridOptions;
    @Output() cellClick = new EventEmitter<GridCell>();
    @Output() barClick = new EventEmitter<BarClickEventParameter>();

    @ViewChild('gridCanvas', { static: false }) canvas: ElementRef;

    private gridParams: GridParameters;

    public canvasHeight: number = 0;
    public canvasWidth: number = 0;

    public puzzle: Puzzle;
    public source: string = "";
    public err: any;

    private viewInitiated = false;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private gridPainter: GridPainterService) {
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

        if (this.options && this.options.readonly) {
            return;
        }

        // TO DO: ignore mouse click on grid padding

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

    private drawGrid(): void {
        if (this.viewInitiated && this.canvas) {
            const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
            const context = canvasEl.getContext('2d');
            this.gridPainter.drawGrid(context, this.puzzle.grid, this.options);
        }
    }
}
