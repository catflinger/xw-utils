import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';
import { Alert, AlertType } from '../ui/common';

export type EditorType = "blogger" | "solver";

export class AppStatus {
    constructor(
        public readonly busy: boolean,
        public readonly late: boolean,
        public readonly alerts: readonly Alert[],
        public readonly editor: EditorType,
    )
    {}
}

@Injectable({
    providedIn: 'root'
})
export class AppService implements OnDestroy {
    private busy: boolean = false;
    private late: boolean = false;
    private busyCounter: number = 0;
    
    private alerts: Alert[] = [];
    private editor: EditorType = "blogger";
    private subs: Subscription[]= [];

    private bs: BehaviorSubject<AppStatus>;

    constructor() {
        this.bs = new BehaviorSubject<AppStatus>(new AppStatus(false, false, [], "blogger"));

        // add a timer that records how long the app has been busy
        // when this time passes a threshold mark the app as late
        this.subs.push(timer(100, 100).subscribe((t) => {
            if (this.busy) {
                this.busyCounter++;
                if (this.busyCounter === 2) {
                    this.late = true;
                    this.emitNext();
                }
            }
        }));

    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    
    public getObservable(): Observable<AppStatus> {
        return this.bs.asObservable();
    }

    public setBusy() {
        this.busy = true;
        this.late = false;
        this.busyCounter = 0;
        this.emitNext();
    }

    public clearBusy() {
        this.busy = false;
        this.late = false;
        this.busyCounter = 0;
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
        this.bs.next(new AppStatus(this.busy, this.late, alerts, this.editor));
    }
}
