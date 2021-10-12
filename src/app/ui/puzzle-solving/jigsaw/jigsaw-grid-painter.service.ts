import { Injectable } from '@angular/core';
import { GridParameters, GridControlOptions, GridParametersSmall } from '../../common';
import { JCell, JGridProperties, Jigsaw } from './jigsaw-model';

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
export class JigsawGridPainterService {

    constructor() { }

    public drawGrid(
        context: CanvasRenderingContext2D, 
        progress: Jigsaw, 
        options: GridControlOptions, 
        gridParams: GridParameters
    ): void {

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.translate(gridParams.gridPadding, gridParams.gridPadding);

        progress.cells.forEach((cell) => {
            this.drawCell(context, cell, options, gridParams, progress.properties);
        });

        // if (caption) {
        //     this.drawGridCaption(context, caption, gridParams, progress.properties);
        // }
    }

    private drawCell(context: CanvasRenderingContext2D, cell: JCell, options: GridControlOptions, gridParams: GridParameters, gridProperties: JGridProperties) {
        const top = cell.y * gridParams.cellSize;
        const left = cell.x * gridParams.cellSize;
        const size = gridParams.cellSize;

        if (!cell.light) {
            // blank-out  the cells that can't hold content
            this.fillCell(context, left, top, gridParams.gridColor, gridParams);

        } else {
            // const showConflicts = options && options.showConflicts;
            // const hideShading = options && options.hideShading;
            // const hideHighlight = options && options.hideHighlight;
            //const cellText = (cell.content && cell.content.trim()) ? cell.content.trim().charAt(0) : null;

            // highlight cells that are in focus
            let bgColor: string = null;
            
            // if (showConflicts && cell.hasConflict)  {
            //     bgColor = gridParams.conflictColor;
            // } else if (cell.highlight && !hideHighlight) {
            //     bgColor = gridParams.highlightColor;
            // } else if (cell.shading && !hideShading)  {
            //     bgColor = cell.shading;
            // }

            this.fillCell(context, left, top, bgColor, gridParams);

            // draw the caption
            if (gridProperties.numbered && cell.anchor) {
                this.drawCellCaption(
                    context,
                    left,
                    top,
                    cell.anchor.toString(),
                    gridParams);
            }

            // draw the cell context
            if (cell.content) {
                this.drawContent(
                    context,
                    left,
                    top,
                    cell.content,
                    gridParams);
            }

            // draw in bars
            if (cell.rightBar) {
                this.drawLine(
                    context,
                    [left + size - gridParams.barWidth + 1, top],
                    [left + size - gridParams.barWidth + 1, top + size],
                    gridParams.barWidth,
                    gridParams.gridColor);
            }

            if (cell.bottomBar) {
                this.drawLine(
                    context,
                    [left, top + size - gridParams.barWidth + 1],
                    [left + size, top + size - gridParams.barWidth + 1],
                    gridParams.barWidth,
                    gridParams.gridColor);
            }
        }

        // all cells get borders regardless of whether they hold content

        // draw top border for cells at the top of the grid
        if (cell.y === 0) {
            this.drawLine(
                context,
                [left, top - 0.5],
                [left + size, top - 0.5],
                gridParams.borderWidth,
                gridParams.gridColor);
        }

        // draw left border for cells at the left of the grid
        if (cell.x === 0) {
            this.drawLine(
                context,
                [left - 0.5, top],
                [left - 0.5, top + size],
                gridParams.borderWidth,
                gridParams.gridColor);
        }

        // draw right border for all cells
        this.drawLine(
            context,
            [left + size - 0.5, top],
            [left + size - 0.5, top + size],
            gridParams.borderWidth,
            gridParams.gridColor);

        // draw bottom border for all cells
        this.drawLine(
            context,
            [left, top + size - 0.5],
            [left + size, top + size - 0.5],
            gridParams.borderWidth,
            gridParams.gridColor);
    }

    private fillCell(context: CanvasRenderingContext2D, left: number, top: number, color: string, gridParams: GridParameters) {
        if (color) {
            context.beginPath();
            context.fillStyle = color;
    
            context.rect(
                left - 1 + gridParams.borderWidth,
                top - 1 + gridParams.borderWidth,
                gridParams.cellSize - gridParams.borderWidth * 2 + 1,
                gridParams.cellSize - gridParams.borderWidth * 2 + 1);
    
            context.fill();
        }
    }

    private drawLine(context: CanvasRenderingContext2D, from: [number, number], to: [number, number], width: number, color: string) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(from[0], from[1]);
        context.lineTo(to[0], to[1]);
        context.stroke();
    }

    private drawCellCaption(context: CanvasRenderingContext2D, left: number, top: number, caption: string, gridParams: GridParameters) {
        context.font = gridParams.captionFont;
        context.textAlign = "start";
        context.textBaseline = "hanging";
        context.direction = "ltr";
        context.fillStyle = gridParams.gridColor;

        context.fillText(
            caption,
            left + gridParams.cellPadding,
            top + gridParams.cellPadding);
    }

    private drawContent(context: CanvasRenderingContext2D, left: number, top: number, content: string, gridParams: GridParameters) {
        context.font = gridParams.textFont;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.direction = "ltr";
        context.fillStyle = gridParams.gridColor;

        context.fillText(
            content,
            left + gridParams.cellSize / 2,
            top + gridParams.cellSize / 2);
    }

    // private drawGridCaption(context: CanvasRenderingContext2D, caption: string, gridParams: GridParameters, gridProps: GridProperties) {
    //     context.font = gridParams.textFont;
    //     context.textAlign = "start";
    //     context.textBaseline = "hanging";
    //     context.direction = "ltr";
    //     context.fillStyle = gridParams.gridColor;

    //     const textWidth = context.measureText(caption);
    //     const textLeft = Math.max(0, (context.canvas.width - gridParams.gridPadding * 2 - textWidth.width) / 2);

    //     context.fillText(
    //         caption,
    //         textLeft,
    //         gridParams.cellSize *  gridProps.size.down + gridParams.gridPadding * 2);

    // }

}
