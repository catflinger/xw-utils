import { IPuzzleModifier } from '../puzzle-modifier';
import { GridStyle, ClueGroup } from 'src/app/model/interfaces';
import { IPuzzle, IGrid, IGridCell } from '../../model/interfaces';

export class RenumberGid implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        let counter = 1;

        if (puzzle.grid) {
            const grid = puzzle.grid;

            for(let y = 0; y < grid.properties.size.down; y++) {
                for(let x = 0; x < grid.properties.size.across; x++) {
                    let cell = grid.cells.find(c => c.x === x && c.y === y);

                    // first try for the first cell of an across word
                    let next = this.nextCellAcross(grid, cell);
                    let previous = this.previousCellAcross(grid, cell);
                    let isStartCell = this.isStartCell(puzzle.grid.properties.style, cell, previous, next, "across");

                    if (!isStartCell) {
                        // no joy, so try for the first cell of a down word
                        next = this.nextCellDown(grid, cell);
                        previous = this.previousCellDown(grid, cell);
                        isStartCell = this.isStartCell(puzzle.grid.properties.style, cell, previous, next, "down");
                    }

                    if (isStartCell) {
                        cell.anchor = counter;
                        counter++;
                    } else {
                        cell.anchor = null;
                    }
                }
            }
        }
    }

    private isStartCell(gridStyle: GridStyle, cell: IGridCell, previous: IGridCell, next: IGridCell, direction: ClueGroup): boolean {
        let result: boolean = false;

        if (gridStyle === "standard") {
            result = cell.light && 
                next && next.light && 
                (!previous || !previous.light); 
        
        } else if (gridStyle === "barred" && direction === "across") {
            result = cell.light && 
                !cell.rightBar &&
                next &&
                (!previous || previous.rightBar || !previous.light); 

        } else if (gridStyle === "barred" && direction === "down") {
            result = cell.light && 
                !cell.bottomBar &&
                next &&
                (!previous || previous.bottomBar || !previous.light); 
        }

        return result;
}

    private nextCellAcross(grid: IGrid, cell: IGridCell): IGridCell {
        const x = cell.x;
        const y = cell.y;

        return x < grid.properties.size.across - 1 ? grid.cells.find(c => c.y === y && c.x === x + 1) : null; 
    }

    private previousCellAcross(grid: IGrid, cell: IGridCell): IGridCell {
        const x = cell.x;
        const y = cell.y;

        return x > 0 ? grid.cells.find(c => c.y === y && c.x === x - 1) : null; 
    }

    private nextCellDown(grid: IGrid, cell: IGridCell): IGridCell {
        const x = cell.x;
        const y = cell.y;

        return y < grid.properties.size.down - 1 ? grid.cells.find(c => c.y === y + 1 && c.x === x) : null; 
    }

    private previousCellDown(grid: IGrid, cell: IGridCell): IGridCell {
        const x = cell.x;
        const y = cell.y;

        return y > 0 ? grid.cells.find(c => c.y === y - 1 && c.x === x) : null; 
    }
}