import { GridStyle } from './puzzle';
import { GridSize } from './grid-size';
import { GridCell, IGridCell } from './grid-cell';

export interface IGrid {
    style: GridStyle;
    size: GridSize;
    cells: readonly IGridCell[];
}

export class Grid implements IGrid {
    public readonly style: GridStyle;
    public readonly size: GridSize;
    public readonly cells: readonly GridCell[];

    constructor(data: any) {
        this.style = data.style;
        this.size = new GridSize(data.size);
        
        let cells: GridCell[] = [];
        data.cells.forEach(cell => cells.push(new GridCell(cell)));
        this.cells = cells;
    }
}