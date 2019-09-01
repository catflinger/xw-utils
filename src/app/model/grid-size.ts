export interface IGridSize {
    across: number;
    down: number;
}

export class GridSize implements IGridSize {
    public readonly across: number;
    public readonly down: number;

    constructor(data: any) {
        this.across = data.across;
        this.down = data.down;
    }
}
