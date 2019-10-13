import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/ui/services/app.service';
import { AppSettings, TipKey } from 'src/app/services/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
    public settings: AppSettings;
    public tipKeys: TipKey[] = [];

    private subs: Subscription[] = [];
    private form: FormGroup;

    constructor(
        private appService: AppService,
        private settingsService: AppSettingsService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            showComments: [false],
            tips: this.formBuilder.group({}),
        });

        const initialSettings = this.settingsService.settings;

        initialSettings.tips.forEach(tip => {
            this.tipKeys.push(tip.key);
            (this.form.controls["tips"] as FormGroup).addControl(tip.key, new FormControl(tip.enabled));
        });

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings;
            settings.tips.forEach(tip => (this.form.controls["tips"] as FormGroup).controls[tip.key].patchValue(tip.enabled));
        }));

    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onSave() {
        let tips = [];
        const tipsGroup = this.form.controls["tips"] as FormGroup;  

        this.tipKeys.forEach(key => {
            tips.push({ key: key, enabled: tipsGroup.controls[key].value })
        });

        this.settingsService.setTips(tips);
        this.appService.returnToSender();
    }
}
