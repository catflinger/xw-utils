import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { GridParameters } from '../../common';
import { GridPainterService } from '../../services/grid-painter.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
    @Input() readonly: boolean;
    @Output() cellClick = new EventEmitter<GridCell>();

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

                            this.canvasWidth = this.gridParams.cellSize * this.puzzle.grid.size.across + this.gridParams.gridPadding * 2;
                            this.canvasHeight = this.gridParams.cellSize * this.puzzle.grid.size.down + this.gridParams.gridPadding * 2;

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

    onCanvasClick(params: any, cellId: string) {

        if (this.readonly) {
            return;
        }

        // TO DO: ignore mouse click on grid padding

        const bounds = this.canvas.nativeElement.getBoundingClientRect();
        let left = params.clientX - bounds.left - this.gridParams.gridPadding;
        let x = Math.floor(left / this.gridParams.cellSize);

        let top = params.clientY - bounds.top - this.gridParams.gridPadding;
        let y = Math.floor(top / this.gridParams.cellSize);

        let cell: GridCell = this.puzzle.cellAt(x, y);
        if (cell) {
            this.cellClick.emit(cell);
        }

    }

    private drawGrid(): void {
        if (this.viewInitiated && this.canvas) {
            const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
            const context = canvasEl.getContext('2d');
            this.gridPainter.drawGrid(context, this.puzzle.grid);
        }
    }
}
