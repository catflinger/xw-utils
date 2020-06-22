import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppStatus, AppService } from 'src/app/ui/general/app.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private detRef: ChangeDetectorRef,
    ) {
    }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;
            this.detRef.detectChanges();
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe);
    }

    public onClose() {
        this.appService.clearAlerts();
        this.detRef.detectChanges();
    }
}
