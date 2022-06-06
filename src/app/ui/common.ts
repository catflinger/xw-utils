export type AlertType = "info" | "danger";

//export type ClueEditor = "annotator" | "clue-editor" | "linker" | "options";
//export type ClueEditorCloseResult = "save" | "cancel" | ClueEditor;

export type UIResult = "ok" | "cancel" | "back";

export type GridSizes = "small" | "large";

export const fifteenSquaredBlack = "#424242";
export const fifteenSquaredBlue = "#4682b4";
export const fifteenSquaredGridBlack = "#424242";

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
    readonly conflictColor: string;
}

export class GridParametersLarge implements GridParameters {
    public readonly cellSize = 33;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly cellPadding = 2;
    public readonly captionFont = "9px serif";
    public readonly textFont = "20px sans-serif";
    public readonly gridColor = "black";
    public readonly highlightColor = "BurlyWood";
    public readonly conflictColor = "Tomato";
}

export class GridParametersSmall implements GridParameters {
    public readonly cellSize = 27;
    public readonly borderWidth = 1;
    public readonly barWidth = 3;
    public readonly gridPadding = 5;
    public readonly cellPadding = 1;
    public readonly captionFont = "8px serif";
    public readonly textFont = "16px sans-serif";
    public readonly gridColor = "black";
    public readonly highlightColor = "BurlyWood";
    public readonly conflictColor = "Tomato";
}

export interface GridControlOptions {
    hideShading?: boolean;
    hideHighlight?: boolean;
    hideGridCaptions?: boolean;
    showConflicts?: boolean;
    //enableTextEdit?: boolean;
    editor?: Symbol;
    size?: GridSizes;
    color?: string;
    showHiddenCells?: boolean;
}

export const GridEditors = {
    cellEditor: Symbol("CellEditor"),
    cellEditorFluid: Symbol("CellEditorFluid"),
    cellEditorEmptyFluid: Symbol("CellEditorEmptyFluid"),
    entryEditor: Symbol("EntryEditor"),
    entryEditorFluid: Symbol("EntryEditorFluid"),
}
