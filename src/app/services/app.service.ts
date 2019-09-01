import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert, AlertType } from '../ui/common';

export class AppStatus {
    constructor(
        public readonly busy: boolean,
        public readonly alerts: readonly Alert[]) 
    {}
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private busy: boolean = false;
    private alerts: Alert[] = [];

    private bs: BehaviorSubject<AppStatus>;

    constructor() {
        this.bs = new BehaviorSubject<AppStatus>(new AppStatus(false, []));
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

    private emitNext() {
        let alerts = JSON.parse(JSON.stringify(this.alerts));
        this.bs.next(new AppStatus(this.busy, alerts));
    }
}
