import { IGrid, GridNavigation, Direction, ClueGroup, IGridReference } from '../interfaces';
import { GridCell } from './grid-cell';
import { GridProperties } from './grid-properties';
import { GridReference } from './grid-reference';

export class Grid implements IGrid {
    public readonly properties: GridProperties;
    public readonly cells: GridCell[];

    constructor(data: any) {
        if (data.size) {
            this.properties = new GridProperties({ 
                size: {
                    across: data.size.across, 
                    down: data.size.down,
                },
                style: data.style,
                numbered: true,
                symmetrical: true,
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

    public *getNavigator(startCellId: string, orientation: GridNavigation, wrap: boolean = true): Iterator<GridCell> {
        const cellsAcross = this.properties.size.across;
        const cellsDown = this.properties.size.down;

        let current: GridCell = this.cells.find(c => c.id === startCellId);
        
        // yield the "start" as the first "next" value
        // the naming seems confusing but is the way that one would expect the iterator to work
        if (current) {
            yield current;
        } else {
            return null as GridCell;
        }

        while (current !== null) {

            switch(orientation) {
                case "right":
                    if (current.x + 1 < cellsAcross) {
                        current = this.cellAt(current.x + 1, current.y);
                    } else if (current.y + 1 < cellsDown) {
                        current = this.cellAt(0, current.y + 1);
                    } else {
                        current = wrap ? this.cellAt(0, 0) : null;
                    }
                    break;
                case "left":
                    if (current.x - 1 >= 0) {
                        current = this.cellAt(current.x - 1, current.y);
                    } else if (current.y - 1 >= 0) {
                        current = this.cellAt(cellsAcross - 1, current.y - 1);
                    } else {
                        current = wrap ? this.cellAt(cellsAcross - 1, cellsDown - 1) : null;
                    }
                    break;
                case "up":
                    if (current.y - 1 >= 0) {
                        current = this.cellAt(current.x, current.y - 1);
                    } else if (current.x - 1 >= 0) {
                        current = this.cellAt(current.x - 1, cellsDown - 1);
                    } else {
                        current = wrap ? this.cellAt(cellsAcross - 1, cellsDown - 1) : null;
                    }
                    break;
                case "down":
                    if (current.y + 1 < cellsDown) {
                        current = this.cellAt(current.x, current.y + 1);
                    } else if (current.x + 1 < cellsDown) {
                        current = this.cellAt(current.x + 1, 0);
                    } else {
                        current = wrap ? this.cellAt(0, 0) : null;
                    }
                    break;
            };

            if (current && current.id !== startCellId) {
                yield current;
            } else {
                return null as GridCell;
            }
        }

        return null as GridCell;
    }

    public getGridEntryForCell(cellId: string): GridCell[] {
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

    public getMaxAnchor(): number {
        const cells = this.cells
            .filter(cell => cell.anchor)
            .sort((a, b) => b.anchor - a.anchor);

        return cells.length > 0 ? cells[0].anchor : 0;
    }

    public getGridEntryFromReference(ref: GridReference): ReadonlyArray<GridCell> {
        let entry: ReadonlyArray<GridCell> = [];

        let startCell = this.cells.find(c => c.anchor === ref.anchor);

        if (startCell) {
            let cells = this.getEntry(startCell, ref.direction);
            if (cells.length > 0 && cells[0].anchor === ref.anchor) {
                entry = cells;
            }
        }

        return entry;
    }

    public getNextClueNumber(startRef: IGridReference): number {

        // TO DO: work how to handle this for non-numbered grids (eg carte blanches etc)
        let clueNumber = startRef.anchor;
        let found = false;

        // find the caption of the next entry in the same direction

        do {
            clueNumber++;
            let startCell = this.cells.find(c => c.anchor === clueNumber);
            let x: number;
            let y : number;
            
            if (!startCell) {
                return null;
            } else {
                x = startCell.x;
                y = startCell.y;
            }

            if (startRef.direction === "across") {
                if (x === 0) {
                    found = true;
                } else {
                    let prevCell = this.cellAt( x - 1, y);
                    
                    if (this.properties.style === "standard") {
                        found = !prevCell.light;
                    } else {
                        found = prevCell.rightBar;
                    }
                }
            } else {
                if (y === 0) {
                    found = true;
                } else {
                    let prevCell = this.cellAt( x, y - 1);
                    
                    if (this.properties.style === "standard") {
                        found = !prevCell.light;
                    } else {
                        found = prevCell.bottomBar;
                    }
                }
            }
        } while (!found);

        return clueNumber;
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

        let cell = nav.next().value;
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
        cell = nav.next().value;
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

    private getEntryDirection(entry: GridCell[]): ClueGroup {
        let result: ClueGroup = "across";

        if (entry && entry.length > 1 && entry[0].x === entry[1].x) {
            result = "down";
        }

        return result;
    }

}