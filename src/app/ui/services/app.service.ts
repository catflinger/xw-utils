
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Alert, AlertType } from '../common';
import { PuzzleProvider } from 'src/app/model/interfaces';

export type LoginCallback = () => void;

export type EditorType = "blogger" | "solver";
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
    sourceDataB64?: string,
    serialNumber?: number,
    date?: Date,
    setter?: string,
}

@Injectable({
    providedIn: 'root'
})
export class AppService implements OnDestroy {
    private busy: boolean = false;
    private late: boolean = false;
    private busyCounter: number = 0;

    private alerts: Alert[] = [];
    private _editor: EditorType = "blogger";
    private _onLogin: LoginCallback = null;
    private subs: Subscription[] = [];
    private returnAddress: string;
    private _openPuzzleParameters: OpenPuzzleParamters;

    private bs: BehaviorSubject<AppStatus>;

    constructor(
        private router: Router,
    ) {
        this.bs = new BehaviorSubject<AppStatus>(
            new AppStatus(
                false,
                false,
                []));

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

    public get openPuzzleParameters(): OpenPuzzleParamters {
        return this._openPuzzleParameters;
    }

    public get loginCallback(): LoginCallback {
        return this._onLogin;
    }

    public get editor(): EditorType {
        return this._editor;
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

    public setEditor(editor: EditorType) {
        this._editor = editor;
    }

    public setReturnAddress(route: string) {
        this.returnAddress = route;
    }

    public returnToSender() {
        const address = this.returnAddress || "/home";

        this.returnAddress = null;
        this.router.navigate([address]);
    }

    private emitNext() {
        let alerts = JSON.parse(JSON.stringify(this.alerts));
        this.bs.next(new AppStatus(this.busy, this.late, alerts));
    }

}
