import { GridCell } from "src/app/model/puzzle-model/grid-cell";
import { Grid } from 'src/app/model/puzzle-model/grid';
import { Direction } from 'src/app/model/interfaces';

class GridWalker {

    constructor(
        private grid: Grid, 
        private direction: Direction) {}

    public walkToNext(): GridCell {
        let start = this.grid.cells.find(c => c.edit);
        let next: GridCell = null;

        if (start) {
            if (this.direction === "across") {
                next = this.nextAcross(start);
            }
            if (!next) {
                this.direction = this.direction === "across" ? "down" : "across";
                //next = this.nextDown(start);
            }
        }
        return next;
    }

    private nextAcross(current: GridCell): GridCell {
        for (let y = current.y; y < this.grid.properties.size.down; y++) {
            for (let x = current.x; x < this.grid.properties.size.across; x++) {
                if (x !== current.x || y !== current.y ) {
                    if (this.grid.properties.style === "barred") {
                        return this.grid.cellAt(x, y);
                    } else if (this.grid.cellAt(x, y).light) {
                        return this.grid.cellAt(x, y);
                    }
                }
            }
        }
        return null;
    }

    private nextDown(grid: Grid, current: GridCell): GridCell {
        for (let x = current.x; x < grid.properties.size.across; x++) {
            for (let y = current.y; y < grid.properties.size.down; y++) {
                if (x !== current.x || y !== current.y ) {
                    if (grid.properties.style === "barred") {
                        return grid.cellAt(x, y);
                    } else if (grid.cellAt(x, y).light) {
                        return grid.cellAt(x, y);
                    }
                }
            }
        }
        return null;
    }
}