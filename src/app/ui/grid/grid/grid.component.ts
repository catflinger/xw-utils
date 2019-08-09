import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, GridCell } from 'src/app/model/puzzle';

class GridParameters {
    public readonly cellSize = 35;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly gridColor = "black";
}

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
    
    @Input() public grid: Grid;
    @ViewChild('gridCanvas', {static: false}) canvas: ElementRef;
    
    private context: CanvasRenderingContext2D;
    private gridParams: GridParameters;

    public canvasHeight: number;
    public canvasWidth: number;

    constructor() {
    }

    ngOnInit() {
        this.gridParams = new GridParameters();
        this.canvasWidth = this.gridParams.cellSize * this.grid.size.across + this.gridParams.gridPadding * 2;
        this.canvasHeight = this.gridParams.cellSize * this.grid.size.down + this.gridParams.gridPadding * 2;
    }

    ngAfterViewInit() {
        this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
        this.drawGrid();
    }

    onCanvasClick(params: any) {

// TO DO: ignore mouse click on grid padding

        const bounds = this.canvas.nativeElement.getBoundingClientRect();
        let left = params.clientX - bounds.left - this.gridParams.gridPadding;
        let x = Math.floor(left / this.gridParams.cellSize );

        let top = params.clientY - bounds.top - this.gridParams.gridPadding;
        let y = Math.floor(top / this.gridParams.cellSize );

        console.log("x=" + x + " y=" + y);
    }

    private drawGrid(): void {
        this.context.translate(this.gridParams.gridPadding, this.gridParams.gridPadding);

        this.grid.cells.forEach((cell) => {
            this.drawCell(cell);
        });
    }

    private drawCell(cell: GridCell) {
        const top = cell.y * this.gridParams.cellSize;
        const left = cell.x * this.gridParams.cellSize;
        const size = this.gridParams.cellSize;

        this.context.strokeStyle = this.gridParams.gridColor;

        // draw top border for cells at the top of the grid
        if (cell.y === 0) {
            this.drawLine([left, top], [left + size, top], this.gridParams.borderWidth);
        }

        // draw left border for cells at the left of the grid
        if (cell.x === 0) {
            this.drawLine([left, top], [left, top + size], this.gridParams.borderWidth);
        }

        // draw right border for all cells
        this.drawLine(
            [left + size, top],
            [left + size, top + size],
            cell.rightBar ? this.gridParams.barWidth : this.gridParams.borderWidth);

        // draw bottom border for all cells
        this.drawLine(
            [left, top + size],
            [left + size, top + size],
            cell.bottomBar ? this.gridParams.barWidth : this.gridParams.borderWidth);

        // fill the cell
        if (! cell.light) {
            this.context.fillStyle = this.gridParams.gridColor;
            this.context.fillRect(left, top, size, size);
        }
    }

    private drawLine(from: [number, number], to: [number, number], width: number) {
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(from[0], from[1]);
        this.context.lineTo(to[0], to[1]);
        this.context.stroke();
    }
}
