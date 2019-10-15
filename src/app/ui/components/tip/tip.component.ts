import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSettingsService, TipKey } from 'src/app/services/app-settings.service';
import { TipInstance, TipStatus, TipInstanceFactory } from './tip-instance';


@Component({
    selector: 'app-tip',
    templateUrl: './tip.component.html',
    styleUrls: ['./tip.component.css'],
})
export class TipComponent implements OnInit, OnDestroy {
    @Input() key: TipKey = "general";
    @Input() maxShowings: number = NaN;
    @Output() instance = new EventEmitter<TipInstance>();

    public status: TipStatus;

    private subs: Subscription[] = [];
    private tipInstance: TipInstance;

    constructor(
        private appSettingsService: AppSettingsService,
        private tipInstanceFactory: TipInstanceFactory)
    {}

    public ngOnInit() {
        this.tipInstance = this.tipInstanceFactory.newInstance(this.key, this.maxShowings)
        this.subs.push(this.tipInstance.observe().subscribe((status) => {
            this.status = status;
        }));
        this.instance.emit(this.tipInstance);
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        if (this.tipInstance){
            this.tipInstance.destroy();
        }
    }

    public onDontShowAgain(event: any) {
        let tips = {};
        tips[this.key] = { enabled: false };
        this.appSettingsService.update({ tips });
    }

    public onClose() {
        this.tipInstance.activated = false;
    }
}
