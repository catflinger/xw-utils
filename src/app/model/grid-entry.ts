import { IGridEntry, ClueGroup } from './interfaces';
import { GridReference } from './grid-reference';

export class GridEntry implements IGridEntry {
    public readonly gridRef: GridReference;
    public readonly cellIds: readonly string[];

    constructor(data: any) {
        this.gridRef = data.gridRef ? new GridReference(data.gridRef) : null;
        
        let cellIds: string[] = [];
        data.cellIds.forEach(id => cellIds.push(id));
        this.cellIds = cellIds;
    }
}
