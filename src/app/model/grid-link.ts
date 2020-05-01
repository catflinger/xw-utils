import { IGridLink, IGridEntry } from '../model3/interfaces';
import { GridEntry } from './grid-entry';

export class GridLink implements IGridLink {
    public readonly warning: string;
    public readonly entries: Array<GridEntry>;

    constructor(data: any) {
        if (data) {
            this.warning = data.warning;
            
            let entries: GridEntry[] = [];
            data.entries.forEach(entry => entries.push(new GridEntry(entry)));
            this.entries = entries;
        }
    }
}