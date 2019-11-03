import { GridStyle, IGrid } from './interfaces';
import { GridSize } from './grid-size';
import { GridCell } from './grid-cell';
import { GridProperties } from './grid-properties';

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
}