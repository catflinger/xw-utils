export type AlertType = "info" | "danger";

export type TextStyleName = "answerStyle" | "clueStyle" | "definitionStyle";

export class Alert {
    constructor(public readonly type: AlertType, public readonly message: string) {}
}

