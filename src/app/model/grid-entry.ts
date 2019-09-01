export interface IGridEntry {
    cellIds: readonly string[];
}
export class GridEntry implements IGridEntry {
    public readonly cellIds: readonly string[];

    constructor(data: any) {
        let cellIds: string[] = [];
        data.cellIds.forEach(id => cellIds.push(id));
        this.cellIds = cellIds;
    }
}