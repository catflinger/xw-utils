import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert, AlertType } from '../ui/common';

export type EditorType = "blogger" | "solver";

export class AppStatus {
    constructor(
        public readonly busy: boolean,
        public readonly alerts: readonly Alert[],
        public readonly editor: EditorType,
    )
    {}
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private busy: boolean = false;
    private alerts: Alert[] = [];
    private editor: EditorType = "blogger";

    private bs: BehaviorSubject<AppStatus>;

    constructor() {
        this.bs = new BehaviorSubject<AppStatus>(new AppStatus(false, [], "blogger"));
    }
    
    public getObservable(): Observable<AppStatus> {
        return this.bs.asObservable();
    }

    public setBusy() {
        this.busy = true;
        this.emitNext();
    }

    public clearBusy() {
        this.busy = false;
        this.emitNext();
    }

    public setAlert(type: AlertType, message: string) {
        this.alerts.push(new Alert(type, message));
        this.emitNext();
    }

    public clearAlerts() {
        this.alerts = [];
        this.emitNext();
    }

    setEditor(editor: EditorType) {
        this.editor = editor;
    }

    private emitNext() {
        let alerts = JSON.parse(JSON.stringify(this.alerts));
        this.bs.next(new AppStatus(this.busy, alerts, this.editor));
    }
}
