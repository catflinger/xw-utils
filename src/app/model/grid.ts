import { IGrid, GridNavigation, Direction } from './interfaces';
import { GridCell } from './grid-cell';
import { GridProperties } from './grid-properties';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

export class Grid implements IGrid {
    public readonly properties: GridProperties;
    public readonly cells: readonly GridCell[];

    constructor(data: any) {
        if (data.size) {
            this.properties = new GridProperties({ 
                size: {
                    across: data.size.across, 
                    down: data.size.down,
                },
                style: data.style,
            });
        } else if (data.properties) {
            this.properties = new GridProperties(data.properties);
        }

        let cells: GridCell[] = [];
        data.cells.forEach(cell => cells.push(new GridCell(cell)));
        this.cells = cells;
    }

    public cellAt(x: number, y: number): GridCell {
        return this.cells.find((cell) => cell.x === x && cell.y === y);
    }

    public *getNavigator(startCellId: string, orientation: GridNavigation): Iterator<GridCell> {
        const cellsAcross = this.properties.size.across;
        const cellsDown = this.properties.size.down;

        let current: GridCell = this.cells.find(c => c.id === startCellId);

        while (current !== null) {

            switch(orientation) {
                case "right":
                    if (current.x + 1 < cellsAcross) {
                        current = this.cellAt(current.x + 1, current.y);
                    } else if (current.y + 1 < cellsDown) {
                        current = this.cellAt(0, current.y + 1);
                    } else {
                        current = this.cellAt(0, 0);
                    }
                    break;
                case "left":
                    if (current.x - 1 >= 0) {
                        current = this.cellAt(current.x - 1, current.y);
                    } else if (current.y - 1 >= 0) {
                        current = this.cellAt(cellsAcross - 1, current.y - 1);
                    } else {
                        current = this.cellAt(cellsAcross - 1, cellsDown - 1);
                    }
                    break;
                case "up":
                    if (current.y - 1 >= 0) {
                        current = this.cellAt(current.x, current.y - 1);
                    } else if (current.x - 1 >= 0) {
                        current = this.cellAt(current.x - 1, cellsDown - 1);
                    } else {
                        current = this.cellAt(cellsAcross - 1, cellsDown - 1);
                    }
                    break;
                case "down":
                    if (current.y + 1 < cellsDown) {
                        current = this.cellAt(current.x, current.y + 1);
                    } else if (current.x + 1 < cellsDown) {
                        current = this.cellAt(current.x + 1, 0);
                    } else {
                        current = this.cellAt(0, 0);
                    }
                    break;
            };

            if (current.id !== startCellId) {
                yield current;
            } else {
                return null as GridCell;
            }
        }
    }

    public getGridEntry(cellId: string): GridCell[] {
        let entry: GridCell[] = [];
        let startCell = this.cells.find(c => c.id === cellId);

        if (startCell && startCell.light) {
            entry = this.getEntry(startCell, "across");
            if (entry.length < 2) {
                entry = this.getEntry(startCell, "down");
            }
        }

        return entry;
    }

    private getEntry(entryCell: GridCell, direction: Direction): GridCell[] {
        let result: GridCell[] = [];
        let startCell: GridCell = null;

        const indexProp = direction === "across" ? "x" : "y";
        const barProp = direction === "across" ? "rightBar" : "bottomBar";
        const forwards = direction === "across" ? "right" : "down";
        const backwards = direction === "across" ? "left" : "up";
        const gridSize = direction === "across" ? this.properties.size.across : this.properties.size.down;

        // first backtrack looking for the start of the entry
        let nav = this.getNavigator(entryCell.id, backwards);
        let cell = entryCell;
        let next = nav.next().value;

        while(cell) {
            if (cell[indexProp] === 0 ||
                (next && !next.light) ||
                (next && next[barProp])) {
                
                // found first cell in entry
                startCell = cell;
                cell = null;
                next = null;
            } else {
                cell = next;
                next = nav.next().value;
            }
        };

        // now go forward again looking for the end of the entry
        nav = this.getNavigator(startCell.id, forwards);
        cell = startCell;
        next = nav.next().value;

        while(cell) {
            result.push(cell);

            if (cell[indexProp] === gridSize - 1 ||
                cell[barProp] ||
                (next && !next.light)) {

                //found last cell in entry
                cell = null;
                next = null;
            } else {
                cell = next;
                next = nav.next().value;
            }
        };

        return result;
    }

}