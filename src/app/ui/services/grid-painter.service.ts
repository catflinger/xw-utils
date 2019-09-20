import { Injectable } from '@angular/core';
import { GridParameters } from '../common';
import { Grid } from 'src/app/model/grid';
import { GridCell } from 'src/app/model/grid-cell';

@Injectable({
    providedIn: 'root'
})
export class GridPainterService {

    private gridParams: GridParameters = new GridParameters();

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    constructor() { }

    public drawGrid(context: CanvasRenderingContext2D, grid: Grid): void {

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.translate(this.gridParams.gridPadding, this.gridParams.gridPadding);

        grid.cells.forEach((cell) => {
            this.drawCell(context, cell);
        });

    }

    private drawCell(context: CanvasRenderingContext2D, cell: GridCell) {
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
