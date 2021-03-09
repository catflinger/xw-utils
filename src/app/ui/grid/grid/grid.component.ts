import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridNavigation, WritingDirection } from 'src/app/model/interfaces';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridControlOptions, GridParameters, GridParametersSmall, GridParametersLarge, fifteenSquaredBlack } from '../../common';
import { GridPainterService } from '../grid-painter.service';

export type BarClickEvent = {cell: GridCell, bar: "rightBar" | "bottomBar" };

export type GridTextEvent = { 
    text: string,
    writingDirection: WritingDirection,
}

export type GridNavigationEvent = { 
    navigation: GridNavigation,
}

type GridInput = { 
    text: string,
    style: { 
        display: string,
        top: string,
        left: string,
        height: string,
        width: string,
        border: string,
        color:string,
    }, 
}
const editBorderWidth = 2;

const gridInputDefaults: GridInput = { 
    text: "", 
    style: {
        display: "none",
        top: "0px",
        left: "0px",
        height: "50px",
        width: "50px",
        border: `${editBorderWidth}px gold solid`,
        color: "black",
    }
};

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() options: GridControlOptions;
    @Input() caption: string = "";

    @Output() cellClick = new EventEmitter<GridCell>();
    @Output() barClick = new EventEmitter<BarClickEvent>();
    @Output() gridText = new EventEmitter<GridTextEvent>();
    @Output() gridNavigation = new EventEmitter<GridNavigationEvent>();

    @ViewChild('gridCanvas', { static: false }) canvas: ElementRef;
    @ViewChild('editor', { static: false }) editor: ElementRef;

    public canvasHeight: number = 0;
    public canvasWidth: number = 0;
    public puzzle: Puzzle;
    public source: string = "";
    public err: any;
    public model: GridInput = gridInputDefaults;

    private gridParams: GridParameters;
    private viewInitiated = false;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private gridPainter: GridPainterService,
        private detRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.gridParams = this.options && this.options.size === "small" ?
            new GridParametersSmall() :
            new GridParametersLarge();

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    this.puzzle = puzzle;

                    if (puzzle && this.puzzle.grid) {
                        this.model.style.display = "none";

                        this.resizeCanvas();

                        let cell = this.puzzle.grid.cells.find(c => c.edit);

                        if (cell) {
                            this.openEditor(cell);
                        }

                        // don't draw the grid until the native canvas has had a chance to resize
                        setTimeout(() => { 
                            this.drawGrid(this.caption); 
                            //this.detRef.detectChanges() 
                        }, 0);

                        this.detRef.detectChanges();
                    }
                },
                (err) => {
                    this.err = err;
                }
            )
        );
    }

    private resizeCanvas() {
        if (this.puzzle) {
            const captionHeight = this.caption ? this.gridParams.cellSize + this.gridParams.gridPadding * 3 : 0;

            this.canvasWidth = this.gridParams.cellSize * this.puzzle.grid.properties.size.across + this.gridParams.gridPadding * 2;
            this.canvasHeight = this.gridParams.cellSize * this.puzzle.grid.properties.size.down + this.gridParams.gridPadding * 2 + captionHeight;
            }
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    public ngAfterViewInit() {
        this.viewInitiated = true;
        this.drawGrid(this.caption);
    }

    public ngOnChanges() {
        this.resizeCanvas();

        setTimeout(_ => {
            this.drawGrid(this.caption);
            this.detRef.detectChanges();
        },
        0)
    }

    public onCanvasClick(params: any) {
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

        let cell: GridCell = this.puzzle.grid.cellAt(i, j);
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
                this.barClick.emit({ cell: this.puzzle.grid.cellAt(i - 1, j), bar: "rightBar"});
            } else if (j > 0 && y < tolerance) {
                // click is near top edge of this cell, so bottom edge of previous cell
                this.barClick.emit({ cell: this.puzzle.grid.cellAt(i, j - 1), bar: "bottomBar"});
            }
        }
    }

    public onInput(event: KeyboardEvent) {

        if (RegExp("^[A-Z ]$", "i").test(event.key)) {
            let key = event.key.trim().toUpperCase()
            this.gridText.emit({ text: event.key.toUpperCase(), writingDirection: "forward" });

        } else if (event.key === "Backspace") {
            this.gridText.emit({ text: "", writingDirection: "backward" });

        } else if (event.key === "Delete") {
            this.gridText.emit({ text: "", writingDirection: "static"});

        } else if (event.key === "ArrowRight") {
            this.gridNavigation.emit({ navigation: "right"});

        } else if (event.key === "ArrowLeft") {
            this.gridNavigation.emit({ navigation: "left" });

        } else if (event.key === "ArrowUp") {
            this.gridNavigation.emit({ navigation: "up" });

        } else if (event.key === "ArrowDown") {
            this.gridNavigation.emit({ navigation: "down" });

        } else if (event.key === "Enter" || event.key === "Escape" || event.key === "Tab") {
            this.gridNavigation.emit({ navigation: null });
        }
        event.preventDefault();
    }

    public getDataUrl(encoding: string): string {
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        const context = canvas.getContext('2d');
        let params = { ...this.gridParams };
            
        if (this.options && this.options.color) {
            params.gridColor = this.options.color;
        }

        this.gridPainter.drawGrid(context, this.puzzle.grid, this.options, params, this.caption);

        return canvas.toDataURL(`image/${encoding}`);
    }


    private drawGrid(caption: string): void {
        if (this.puzzle && this.puzzle.grid && this.viewInitiated && this.canvas) {
            const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
            const context = canvasEl.getContext('2d');

            let params = { ...this.gridParams };
            
            if (this.options && this.options.color) {
                params.gridColor = this.options.color;
            }

            this.gridPainter.drawGrid(context, this.puzzle.grid, this.options, params, caption);
        }
    }

    private openEditor(cell: GridCell) {
        const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
        const context = canvasEl.getContext('2d');

        let cellInfo = this.gridPainter.getCellInfo(context, this.puzzle.grid, cell.id, this.gridParams);

        let top = cellInfo.top - editBorderWidth;
        let left = cellInfo.left - editBorderWidth;
        let height = cellInfo.height + 2 * editBorderWidth;
        let width = cellInfo.width + 2 * editBorderWidth;

        if (cellInfo) {
            this.model.text = cell.content;
            this.model.style.top = top.toString() + cellInfo.unit;
            this.model.style.left = left.toString() + cellInfo.unit;
            this.model.style.height = height.toString() + cellInfo.unit;
            this.model.style.width = width.toString() + cellInfo.unit;
            this.model.style.display = "block";

            setTimeout(() => {
                this.editor.nativeElement.focus();
            }, 0); 
        } else {
            this.model.style.display = "none";
        }
    }

}
