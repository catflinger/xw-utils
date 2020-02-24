export type AlertType = "info" | "danger";

//export type TextStyleName = "answerStyle" | "clueStyle" | "definitionStyle";

export type NavAction = "solve" | "login";

export type UIResult = "ok" | "cancel" | "back";

export type GridSizes = "small" | "large";

export interface NavResult {
    action: NavAction;
    paramter: string;
}

export class Alert {
    constructor(public readonly type: AlertType, public readonly message: string) {}
}

export interface GridParameters {
    readonly cellSize: number;
    readonly borderWidth: number;
    readonly barWidth: number;
    readonly gridPadding: number;
    readonly cellPadding: number;
    readonly captionFont: string;
    readonly textFont: string;
    readonly gridColor: string;
    readonly highlightColor: string;
}

export class GridParametersLarge implements GridParameters {
    public readonly cellSize = 33;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly cellPadding = 2;
    public readonly captionFont = "9px serif";
    public readonly textFont = "20px sans-serif";
    public readonly gridColor = "#000000";
    public readonly highlightColor = "BurlyWood";
}

export class GridParametersSmall implements GridParameters {
    public readonly cellSize = 27;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly cellPadding = 1;
    public readonly captionFont = "8px serif";
    public readonly textFont = "16px sans-serif";
    public readonly gridColor = "#000000";
    public readonly highlightColor = "BurlyWood";
}

export interface GridControlOptions {
    showShading?: boolean;
    //enableTextEdit?: boolean;
    editor?: Symbol;
    size?: GridSizes;
}

export const GridEditors = {
    cellEditor: Symbol("CellEditor"),
    cellEditorFluid: Symbol("CellEditorFluid"),
    cellEditorEmptyFluid: Symbol("CellEditorEmptyFluid"),
    entryEditor: Symbol("EntryEditor"),
    entryEditorFluid: Symbol("EntryEditorFluid"),
}
