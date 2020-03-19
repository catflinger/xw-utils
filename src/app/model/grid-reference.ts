import { IGridReference, Direction } from './interfaces';

export class GridReference implements IGridReference {
    // for example: 2 down or 23 across
    public readonly caption: number;
    public readonly direction: Direction;

    constructor(data: any) {
        if (data) {
            this.caption = data.caption;
            this.direction = data.direction;
        }
     }
}

