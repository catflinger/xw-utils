import { GridStyle, IGridProperties } from '../interfaces';
import { GridSize } from './grid-size';

export class GridProperties implements IGridProperties {
    public readonly style: GridStyle;
    public readonly size: GridSize;
    public readonly symmetrical: boolean;
    public readonly numbered: boolean;

    constructor(data: any) {
        this.style = data.style;
        this.symmetrical = !!data.symmetrical;
        this.numbered = typeof data.numbered === "boolean" ? data.numbered : true;
        this.size = new GridSize(data.size);
    }
}