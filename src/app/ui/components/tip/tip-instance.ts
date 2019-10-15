import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AppSettingsService, TipKey } from 'src/app/services/app-settings.service';
import { Injectable } from '@angular/core';

export class TipStatus {
    constructor(
        public readonly enabled: boolean,
        public readonly active: boolean,
        public readonly activationCountExceeded: boolean, 
    ) {}

    public get show(): boolean {
        return this.enabled && this.active  && !this.activationCountExceeded;
    }
}

export class TipInstance {
    private bs: BehaviorSubject<TipStatus>;
    private activationCounter: number = 0;
    private subs: Subscription[] = [];

    constructor(
        settingsService: AppSettingsService, 
        private key: TipKey,
        private maxActivations: number,
    ) {
        this.bs = new BehaviorSubject<TipStatus>(new TipStatus(false, true, false));

        this.subs.push(settingsService.observe().subscribe((settings) => {
            const current = this.bs.value;
            this.bs.next(new TipStatus(
                settings.tips[this.key].enabled, 
                current.active, 
                this.activationCounter > this.maxActivations));
        }));
    }

    public observe(): Observable<TipStatus> {
        return this.bs.asObservable();
    }

    public set activated(active: boolean) {
        const current = this.bs.value;

        if (!current.active && active) {
            this.activationCounter++;
        }
        this.bs.next(new TipStatus(
            current.enabled, 
            active, 
            this.activationCounter > this.maxActivations));
    };

    public destroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
}

@Injectable()
export class TipInstanceFactory {
    constructor(private appSettingsService: AppSettingsService) 
    {}

    public newInstance(key: TipKey, maxAxtivations: number): TipInstance {
        return new TipInstance(this.appSettingsService, key, maxAxtivations);
    }
}
