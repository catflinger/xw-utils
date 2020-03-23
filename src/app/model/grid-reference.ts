import { IGridReference, Direction } from './interfaces';
import { v4 as uuid } from "uuid";
import { ObjectUnsubscribedError } from 'rxjs';

export class GridReference implements IGridReference {
    // for example: 2 down or 23 across
    public readonly id: string;
    public readonly caption: number;
    public readonly direction: Direction;

    constructor(data: any) {
        if (data) {
            this.id = data.id || uuid();
            this.caption = typeof data.caption === "string" ? parseInt(data.caption) : data.caption;
            this.direction = data.direction;
        }
     }
}

