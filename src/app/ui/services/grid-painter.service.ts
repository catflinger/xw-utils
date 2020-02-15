import { Injectable } from '@angular/core';
import { GridParameters, GridControlOptions, GridParametersSmall } from '../common';
import { Grid } from 'src/app/model/grid';
import { GridCell } from 'src/app/model/grid-cell';

export class GridDisplayInfo {
    public top: number;
    public left: number;
    public height: number;
    public width: number;
    public unit: "px";
}

@Injectable({
    providedIn: 'root'
})
export class GridPainterService {

    private gridParams: GridParameters = new GridParametersSmall();

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    constructor() { }

    // public getGridInfo(context: CanvasRenderingContext2D, grid: Grid, options: GridOptions): GridDisplayInfo {
    //     let rect = context.canvas.getBoundingClientRect();

    //     return {
    //         top: rect.top + window.scrollX,
    //         left: rect.bottom + window.scrollY,
    //         height:rect.height,
    //         width: rect.width,
    //         unit: "px",
    //     }
    // }

    public getCellInfo(context: CanvasRenderingContext2D, grid: Grid, cellId: string): GridDisplayInfo {
        let cell = grid.cells.find(c => c.id === cellId);

        if (!cell) {
            return null;
        } else {
            // TO DO: this calculation is duplicated when drawing the grid
            // make this a common function
            const top = this.gridParams.gridPadding - this.gridParams.borderWidth + cell.y * this.gridParams.cellSize;
            const left = this.gridParams.gridPadding - this.gridParams.borderWidth + cell.x * this.gridParams.cellSize;
            const size = this.gridParams.cellSize + 2 * this.gridParams.borderWidth;

            return {
                top,
                left,
                height: size,
                width: size,
                unit: "px",
            };
        }
    }

    public drawGrid(context: CanvasRenderingContext2D, grid: Grid, options: GridControlOptions): void {

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.translate(this.gridParams.gridPadding, this.gridParams.gridPadding);

        grid.cells.forEach((cell) => {
            this.drawCell(context, cell, options);
        });
    }

    private drawCell(context: CanvasRenderingContext2D, cell: GridCell, options: GridControlOptions) {
        const top = cell.y * this.gridParams.cellSize;
        const left = cell.x * this.gridParams.cellSize;
        const size = this.gridParams.cellSize;

        if (!cell.light) {
            // blank-out  the cells that can't hold content
            this.fillCell(context, left, top, this.gridParams.gridColor);

        } else {

            // highlight cells that are in focus
            if (cell.highlight) {
                this.fillCell(context, left, top, this.gridParams.highlightColor);
            } else if (options && options.showShading && cell.shading)  {
                this.fillCell(context, left, top, cell.shading);
            }

            // draw the caption
            if (cell.caption.trim()) {
                this.drawCaption(
                    context,
                    left,
                    top,
                    cell.caption.trim());
            }

            // draw the cell context
            if (cell.content.trim()) {
                this.drawContent(
                    context,
                    left,
                    top,
                    cell.content.trim());
            }

            // draw in bars
            if (cell.rightBar) {
                this.drawLine(
                    context,
                    [left + size - this.gridParams.barWidth + 1, top],
                    [left + size - this.gridParams.barWidth + 1, top + size],
                    this.gridParams.barWidth,
                    this.gridParams.gridColor);
            }

            if (cell.bottomBar) {
                this.drawLine(
                    context,
                    [left, top + size - this.gridParams.barWidth + 1],
                    [left + size, top + size - this.gridParams.barWidth + 1],
                    this.gridParams.barWidth,
                    this.gridParams.gridColor);
            }
        }

        // all cells get borders regardless of whether they hold content

        // draw top border for cells at the top of the grid
        if (cell.y === 0) {
            this.drawLine(
                context,
                [left, top - 0.5],
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
            this.gridParams.borderWidth,
            this.gridParams.gridColor);

        // draw bottom border for all cells
        this.drawLine(
            context,
            [left, top + size - 0.5],
            [left + size, top + size - 0.5],
            this.gridParams.borderWidth,
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

    private drawCaption(context: CanvasRenderingContext2D, left: number, top: number, caption: string) {
        context.font = this.gridParams.captionFont;
        context.textAlign = "start";
        context.textBaseline = "hanging";
        context.direction = "ltr";
        context.fillStyle = this.gridParams.gridColor;

        context.fillText(
            caption,
            left + this.gridParams.cellPadding,
            top + this.gridParams.cellPadding);
    }

    private drawContent(context: CanvasRenderingContext2D, left: number, top: number, content: string) {
        context.font = this.gridParams.textFont;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.direction = "ltr";
        context.fillStyle = this.gridParams.gridColor;

        context.fillText(
            content,
            left + this.gridParams.cellSize / 2,
            top + this.gridParams.cellSize / 2);
    }

}
