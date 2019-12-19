
import { Injectable, OnDestroy, Type } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';
import { Alert, AlertType } from '../common';
import { PuzzleProvider, Base64Encoded } from 'src/app/model/interfaces';

// TO DO: do we still need this?
export type LoginCallback = () => void;

export type OpenPuzzleAction = "openByDate" | "openLatest";

export class AppStatus {
    constructor(
        public readonly busy: boolean,
        public readonly late: boolean,
        public readonly alerts: readonly Alert[],
    ) { }
}

export interface OpenPuzzleParamters {
    provider: PuzzleProvider,
    username?: string;
    password?: string;
    title?: string,
    sourceUrl?: string,
    sourceText?: string,
    sourceDataB64?: Base64Encoded,
    serialNumber?: number,
    date?: Date,
    setter?: string,
}

class ActivityMonitor {
    public busy: boolean = false;
    public late: boolean = false;
    public busyCounter: number = 0;

    public clear() {
        this.busy = false;
        this.late = false;
        this.busyCounter = 0;
    }

    public setBusy() {
        this.busy = true;
        this.late = false;
        this.busyCounter = 0;
    }

    public onTick(): boolean {
        let emitEvent = false;

        if (this.busy) {
            this.busyCounter++;
            if (this.busyCounter === 2) {
                this.late = true;
                emitEvent = true;
            }
        }
        return emitEvent;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppService implements OnDestroy {
    private _activityMonitor: ActivityMonitor = new ActivityMonitor();
    private alerts: Alert[] = [];
    private _onLogin: LoginCallback = null;
    private subs: Subscription[] = [];
    private _openPuzzleParameters: OpenPuzzleParamters;

    private bs: BehaviorSubject<AppStatus>;

    constructor() {
        this.bs = new BehaviorSubject<AppStatus>(
            new AppStatus(
                false,
                false,
                []));

        // add a timer that records how long the app has been busy
        // when this time passes a threshold mark the app as late
        this.subs.push(timer(100, 100).subscribe((t) => {
            if (this._activityMonitor.onTick()) {
                this.emitNext();
            }
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public getObservable(): Observable<AppStatus> {
        return this.bs.asObservable();
    }

    public get openPuzzleParameters(): OpenPuzzleParamters {
        return this._openPuzzleParameters;
    }

    public get loginCallback(): LoginCallback {
        return this._onLogin;
    }

    public clear() {
        this.clearLoginCallback();
        this.clearAlerts();
        this.clearBusy();
    }

    public setOpenPuzzleParams(params: OpenPuzzleParamters) {
        this._openPuzzleParameters = params;
    }

    public clearOpenPuzzleParams() {
        this._openPuzzleParameters = null;
    }

    public setLoginCallback(fn: LoginCallback) {
        this._onLogin = fn;
    }

    public clearLoginCallback() {
        this._onLogin = null;
    }

    public setBusy() {
        this._activityMonitor.setBusy();
        this.emitNext();
    }

    public clearBusy() {
        this._activityMonitor.clear();
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

    private emitNext() {
        let alerts = JSON.parse(JSON.stringify(this.alerts));
        this.bs.next(new AppStatus(this._activityMonitor.busy, this._activityMonitor.late, alerts));
    }

}

