import { IGridReference, Direction } from '../interfaces';
import { v4 as uuid } from "uuid";
import { ObjectUnsubscribedError } from 'rxjs';

export class GridReference implements IGridReference {
    // for example: 2 down or 23 across
    public readonly id: string;
    public readonly label: number;
    public readonly direction: Direction;

    constructor(data: any) {
        if (data) {
            this.id = data.id || uuid();

            if (typeof data.caption === "string") {
                this.label = parseInt(data.caption);
            } else if (typeof data.caption === "number") {
                this.label = data.caption;
            } else {
                this.label = data.label;
            }
            this.direction = data.direction;
        }
     }
}

