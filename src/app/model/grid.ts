import { GridStyle, IGrid } from './interfaces';
import { GridSize } from './grid-size';
import { GridCell } from './grid-cell';

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