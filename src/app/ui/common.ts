export type AlertType = "info" | "danger";

export class Alert {
    constructor(public readonly type: AlertType, public readonly message: string) {}
}

