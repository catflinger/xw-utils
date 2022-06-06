import { Injectable } from '@angular/core';
import { GridParameters, GridControlOptions, GridParametersSmall } from '../common';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { GridProperties } from 'src/app/model/puzzle-model/grid-properties';

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

    //private gridParams: GridParameters = new GridParametersSmall();

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

    public getCellInfo(context: CanvasRenderingContext2D, grid: Grid, cellId: string, gridParams: GridParameters): GridDisplayInfo {
        let cell = grid.cells.find(c => c.id === cellId);

        if (!cell) {
            return null;
        } else {
            // TO DO: this calculation is duplicated when drawing the grid
            // make this a common function
            const top = gridParams.gridPadding - gridParams.borderWidth + cell.y * gridParams.cellSize;
            const left = gridParams.gridPadding - gridParams.borderWidth + cell.x * gridParams.cellSize;
            const size = gridParams.cellSize + 2 * gridParams.borderWidth;

            return {
                top,
                left,
                height: size,
                width: size,
                unit: "px",
            };
        }
    }

    public drawGrid(context: CanvasRenderingContext2D, grid: Grid, options: GridControlOptions, gridParams: GridParameters, caption: string): void {

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.translate(gridParams.gridPadding, gridParams.gridPadding);

        grid.cells.forEach((cell) => {
            this.drawCell(context, cell, options, gridParams, grid.properties);
        });

        this.drawOuterBoders(context, grid, gridParams)

        if (caption) {
            this.drawGridCaption(context, caption, gridParams, grid.properties);
        }
    }

    private drawCell(context: CanvasRenderingContext2D, cell: GridCell, options: GridControlOptions, gridParams: GridParameters, gridProperties: GridProperties) {
        const top = cell.y * gridParams.cellSize;
        const left = cell.x * gridParams.cellSize;
        const size = gridParams.cellSize;

        if (cell.hidden) {
            if (options?.showHiddenCells) {
                this.fillCellWithHatching(context, left, top, "lightgray", gridParams);
            }

        } else if (!cell.light) {
            // blank-out  the cells that can't hold content
            this.fillCell(context, left, top, gridParams.gridColor, gridParams);

        } else {
            const showConflicts = options?.showConflicts;
            const hideShading = options?.hideShading;
            const hideHighlight = options?.hideHighlight;
            const cellText = (cell.content && cell.content.trim()) ? cell.content.trim().charAt(0) : null;

            // highlight cells that are in focus
            let bgColor: string = null;

            if (showConflicts && cell.hasConflict) {
                bgColor = gridParams.conflictColor;
            } else if (cell.highlight && !hideHighlight) {
                bgColor = gridParams.highlightColor;
            } else if (cell.shading && !hideShading) {
                bgColor = cell.shading;
            }

            this.fillCell(context, left, top, bgColor, gridParams);

            // draw the caption
            if (gridProperties.showCaptions && cell.caption) {
                this.drawCellCaption(
                    context,
                    left,
                    top,
                    cell.caption,
                    gridParams);
            }

            // draw the cell context
            if (cellText) {
                this.drawContent(
                    context,
                    left,
                    top,
                    cellText,
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

        if (!cell.hidden) {


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

    private fillCellWithHatching(context: CanvasRenderingContext2D, left: number, top: number, color: string, gridParams: GridParameters) {
        const dashLength: number = gridParams.cellSize / 10;

        if (color) {
            for (let y = top; y < top + gridParams.cellSize; y = y + dashLength) {
                context.beginPath();
                context.strokeStyle = color;
                context.lineWidth = 1;
                context.setLineDash([dashLength, dashLength]);
                context.moveTo(left, y);
                context.lineTo(left + gridParams.cellSize, y);
                context.stroke();

                context.setLineDash([]);
            }
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

    private drawGridCaption(context: CanvasRenderingContext2D, caption: string, gridParams: GridParameters, gridProps: GridProperties) {
        context.font = gridParams.textFont;
        context.textAlign = "start";
        context.textBaseline = "hanging";
        context.direction = "ltr";
        context.fillStyle = gridParams.gridColor;

        const textWidth = context.measureText(caption);
        const textLeft = Math.max(0, (context.canvas.width - gridParams.gridPadding * 2 - textWidth.width) / 2);

        context.fillText(
            caption,
            textLeft,
            gridParams.cellSize * gridProps.size.down + gridParams.gridPadding * 2);
    }

    private drawOuterBoders(context: CanvasRenderingContext2D, grid: Grid, gridParams: GridParameters) {
        grid.cells.forEach((cell) => {
            let drawLeftBorder = false;
            let drawTopBorder = false;

            if (cell.x === 0) {
                if (!cell.hidden) {
                    drawLeftBorder = true;
                }
            } else {
                let previousCell = grid.cellAt(cell.x - 1, cell.y);

                if (!cell.hidden && previousCell.hidden) {
                    drawLeftBorder = true;
                }
            }

            if (cell.y === 0) {
                if (!cell.hidden) {
                    drawTopBorder = true;
                }
            } else {
                let previousCell = grid.cellAt(cell.x, cell.y - 1);

                if (!cell.hidden && previousCell.hidden) {
                    drawTopBorder = true;
                }
            }

            const top = cell.y * gridParams.cellSize;
            const left = cell.x * gridParams.cellSize;

            if (drawLeftBorder) {
                this.drawLine(
                    context,
                    [left - 0.5, top],
                    [left - 0.5, top + gridParams.cellSize],
                    gridParams.borderWidth,
                    gridParams.gridColor);
            }

            if (drawTopBorder) {
                this.drawLine(
                    context,
                    [left, top - 0.5],
                    [left + gridParams.cellSize, top - 0.5],
                    gridParams.borderWidth,
                    gridParams.gridColor);
            }
        });

    }

}
