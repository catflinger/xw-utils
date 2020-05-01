import { IGridCell } from '../model3/interfaces';

export class GridCell implements IGridCell {
    public readonly id: string;
    public readonly x: number;
    public readonly y: number;
    public readonly caption: number;
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

        if (data.caption && typeof data.caption === "string") {
            this.caption = parseInt(data.caption);
        } else {
            this.caption = data.caption;
        }
    }
}