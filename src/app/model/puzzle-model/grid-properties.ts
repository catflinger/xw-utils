import { GridStyle, IGridProperties } from '../interfaces';
import { GridSize } from './grid-size';

export class GridProperties implements IGridProperties {
    public readonly style: GridStyle;
    public readonly size: GridSize;
    public readonly symmetrical: boolean;

    constructor(data: any) {
        this.style = data.style;
        this.symmetrical = data.symmetrical;
        this.size = new GridSize(data.size);
    }
}