import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { TipKey, AppSettings } from 'src/app/services/common';

export class TipInstance {
    private bsActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private shown: boolean;   // the tip has been shown already in this instance
    public  key: TipKey;      // TO DO: how to keep setter only for TipComponent?

    constructor(private settings: AppSettings) {
    }

    public observe(): Observable<boolean> {
        return this.bsActive.asObservable();
    }

    public get hasBeenShown(): boolean {
        return this.shown || !this.settings.tips;
    }

    public open() {
        if (this.settings.tipIsEnabled(this.key) && !this.shown) {
            this.bsActive.next(true);
            this.shown = true;
        }
    };

    public close() {
        this.bsActive.next(false);
    }
}

const tipInstanceFactory = (appSettingsService: AppSettingsService) => {
    return new TipInstance(appSettingsService.settings);
  };

export const tipInstanceProvider = {
    provide: TipInstance,
    useFactory: tipInstanceFactory,
    deps: [AppSettingsService]
}

@Component({
    selector: 'app-tip',
    templateUrl: './tip.component.html',
    styleUrls: ['./tip.component.css'],
    providers: [tipInstanceProvider],
})
export class TipComponent implements OnInit, OnDestroy {
    @Input() key: TipKey;
    @Output() instance = new EventEmitter<TipInstance>();
    public show: boolean;
 
    private subs: Subscription[] = [];

    constructor(
        private appSettingsService: AppSettingsService,
        private tipInstance: TipInstance) {}

    public ngOnInit() {
        this.tipInstance.key = this.key;
        this.subs.push(this.tipInstance.observe().subscribe(show => this.show = show));
        this.instance.emit(this.tipInstance);
    }

    public ngOnDestroy() {
       this.subs.forEach(s => s.unsubscribe());
    }

    public onClose() {
        this.tipInstance.close();
    }

    public onDontShowAgain(event: any) {
         this.appSettingsService.disableAllTips();
    }
}
