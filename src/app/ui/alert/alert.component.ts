import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public subs: Subscription[] = [];

    constructor(private appService: AppService) {
    }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe);
    }

    public onClose() {
        this.appService.clearAlerts();
    }
}
