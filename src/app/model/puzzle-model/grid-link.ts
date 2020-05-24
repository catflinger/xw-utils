import { IGridLink } from '../interfaces';
import { GridReference } from './grid-reference';

export class GridLink implements IGridLink {
    public readonly warning: string;
    public readonly gridRefs: Array<GridReference>;

    constructor(data: any) {
        if (data) {
            this.warning = data.warning ? data.warning : null;
            
            let gridRefs: GridReference[] = [];

            if (data.entires) {
                data.entries.forEach(entry => gridRefs.push(new GridReference(entry)));
            } else if (data.gridRefs) {
                data.gridRefs.forEach(ref => gridRefs.push(new GridReference(ref)));
            }

            this.gridRefs = gridRefs;
        }
    }
}