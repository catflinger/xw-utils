import { IGridCell } from '../interfaces';

export class GridCell implements IGridCell {
    public readonly id: string;
    public readonly x: number;
    public readonly y: number;
    public readonly anchor: number;
    public readonly content: string;
    public readonly light: boolean;
    public readonly rightBar: boolean;
    public readonly bottomBar: boolean;
    public readonly highlight: boolean;
    public readonly shading: string;
    public readonly edit: boolean;
    
    constructor(data: any) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.content = data.content;
        this.light = data.light;
        this.rightBar = data.rightBar;
        this.bottomBar = data.bottomBar;
        this.highlight = data.highlight;
        this.shading = data.shading;
        this.edit = data.edit;

        this.anchor = (data.label || data.anchor) || null;
    }
}