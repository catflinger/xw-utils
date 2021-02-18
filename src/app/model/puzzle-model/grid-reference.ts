import { IGridReference, Direction } from '../interfaces';
import { v4 as uuid } from "uuid";
import { ObjectUnsubscribedError } from 'rxjs';

export class GridReference implements IGridReference {
    // for example: 2 down or 23 across
    public readonly id: string;
    public readonly anchor: number;
    public readonly direction: Direction;

    constructor(data: any) {
        if (data) {
            this.id = data.id || uuid();

            if (typeof data.caption === "string") {
                this.anchor = parseInt(data.caption);
            } else if (typeof data.caption === "number") {
                this.anchor = data.caption;
            } else {
                this.anchor = data.label || data.anchor;
            }
            this.direction = data.direction;
        }
     }
}

