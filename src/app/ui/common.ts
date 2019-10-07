export type AlertType = "info" | "danger";

export type TextStyleName = "answerStyle" | "clueStyle" | "definitionStyle";

export type NavAction = "solve" | "login";

export type UIResult = "ok" | "cancel" | "back";

export interface NavResult {
    action: NavAction;
    paramter: string;
}

export class Alert {
    constructor(public readonly type: AlertType, public readonly message: string) {}
}

export class GridParameters {
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

export interface GridOptions {
    readonly?: boolean;
    showShading?: boolean;
}