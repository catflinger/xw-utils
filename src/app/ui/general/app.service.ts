
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { Alert, AlertType } from '../common';
import { PuzzleProvider, Base64Encoded } from 'src/app/model/interfaces';
import { AppResultSymbols } from 'src/app/services/common';
import { ProvisionOptions } from '../puzzle-editing/provision-options-control/provision-options-control.component';

export type OpenPuzzleAction = "openByDate" | "openLatest";

export class AppStatus {
    constructor(
        public readonly busy: boolean,
        public readonly late: boolean,
        public readonly alerts: readonly Alert[],
    ) { }
}

export interface RecentlyUsed {
    downloadFilename: string,
    downloadEncoding: string,
    downloadCaption: string,
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
    gridPage?: number,
    textPage?: number,
    provisionOptions?: ProvisionOptions,
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
    private subs: Subscription[] = [];
    private _openPuzzleParameters: OpenPuzzleParamters;
    
    private _recentlyUsed: RecentlyUsed = {
        downloadCaption: "",
        downloadEncoding: "png",
        downloadFilename: "grid-image"
    }

    // TO DO: make this more sophisticated
    public get recentlyUsed(): RecentlyUsed {
        return this._recentlyUsed;
    }

    // TO DO: move this to nav service
    private _redirectToRoute: string[] = null;

    private bs: BehaviorSubject<AppStatus>;

    constructor() {
        this.bs = new BehaviorSubject<AppStatus>(
            new AppStatus(
                false,
                false,
                []));

        // add a timer that records how long the app has been busy
        // when this time passes a threshold mark the app as late

        this.subs.push(timer(510, 510).subscribe((t) => {
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

    public clear() {
        this.clearAlerts();
        this.clearBusy();
    }

    public get redirect(): string[] {
        return this._redirectToRoute;
    }

    public set redirect(route: string[]) {
        this._redirectToRoute = route;
    }

    public clearRedirect() {
        this._redirectToRoute = null;
    }

    public setOpenPuzzleParams(params: OpenPuzzleParamters) {
        this._openPuzzleParameters = params;
    }

    public clearOpenPuzzleParams() {
        this._openPuzzleParameters = null;
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
    
    public setAlertError(message: string, error: any) {
        let errorInfo = "";

        try {
            if (error === AppResultSymbols.OK) {
                errorInfo = "";
            } else if (error === AppResultSymbols.AuthorizationFailure) {
                errorInfo = "Authentication failure. A valid username and password is required.";
            } else if (error === AppResultSymbols.Error) {
                errorInfo = "An error has occurred.";
            } else if (typeof error === "string") {
                errorInfo = error;
            } else if (typeof error === "object" && error["message"] && typeof error["message"] === "string") {
                errorInfo = error["message"];
            } else if (typeof error === "object") {
                errorInfo = JSON.stringify(error);
            } else {
                errorInfo = error;
            }
            this.alerts.push(new Alert("danger", message + " " + errorInfo));
        
        } catch {
            this.alerts.push(new Alert("danger", message));
        }
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

