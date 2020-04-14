/*
*   Tips can be shown using the tip control:
* 
*       <app-tip> Your text goes here... </app-tip>
*
*   Tips can be disabled by the user by clicking the don't show again checkbox. To control
*   which tips are disabled provide a key for the tip.  If no key is specified the key will be "general".
*   Any tip with that key will no longer be shown (see AppSettingsService for more information on settings keys).
* 
*       <app-tip key="validationWarnings"> Your text goes here... </app-tip>
*
*   If the user closes the tip with the close buton (X in the top left corner) the tip will not be visible.  This will not prevent
*   the tip reappearing again if it is reactivated (eg if the tip is shown whenever a validation failure occurs).  To prevent this becoming
*   annoying you can set a limit to the number of times a specific instance of a tip will be shown:
*
*      <app-tip maxActivations="1"> Your text goes here... </app-tip>
*
*   If you need to control the behaviour of a particular tip programatically (eg stop only this instance of the tip showing)
*   capture the tip instance in your component using the instance event.  
* 
*       <app-tip (instance)="rtmInit($event)"> <em>read the manual</em> </app-tip>
*
*   And in your code:
*
*       private rtmTip: TipInstance;
*
*       public rtmInit(instance: TipInstance) {
*           this.rtmTip = instance;
*       }
*
*       this.rtmTip.activated = false;
*
*   The state of the tip (eg if it is currently enabled or currently visible) can be observed:
*
*       private rtmStatus: TipStatus;
*
*       this.rtmTip.observe().subscribe(ts => this.rtmStatus = ts);
*
*/

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { TipInstance, TipStatus, TipInstanceFactory } from './tip-instance';
import { TipKey } from 'src/app/services/common';

@Component({
    selector: 'app-tip',
    templateUrl: './tip.component.html',
    styleUrls: ['./tip.component.css'],
})
export class TipComponent implements OnInit, OnDestroy {
    @Input() key: TipKey = "general";
    @Input() maxShowings: number = NaN;
    @Input() suppressable: boolean = true;
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
