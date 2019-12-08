import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/ui/services/app.service';
import { AppSettings, BooleanSettingsGroupKey } from 'src/app/services/common';
import { NavService } from '../../navigation/nav.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
    public settings: AppSettings;

    private subs: Subscription[] = [];
    public form: FormGroup;

    constructor(
        private navService: NavService,
        private appService: AppService,
        private settingsService: AppSettingsService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {

        this.settings = this.settingsService.settings;

        this.form = this.formBuilder.group({
            sandbox: [false],
            footer: [""],
            general: this.formBuilder.group({}),
            tips: this.formBuilder.group({}),
        });

        Object.keys(this.settings.general).forEach(key => {
            (this.form.controls["general"] as FormGroup).addControl(key, new FormControl(this.settings.general[key].enabled));
        });

        Object.keys(this.settings.tips).forEach(key => {
            (this.form.controls["tips"] as FormGroup).addControl(key, new FormControl(this.settings.tips[key].enabled));
        });

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings;

            this.form.patchValue({
                sandbox: settings.sandbox,
                footer: settings.footer,
            });

            Object.keys(this.settings.general).forEach(key => {
                (this.form.get("general") as FormGroup).controls[key].patchValue(settings.general[key].enabled);
            });

            Object.keys(this.settings.tips).forEach(key => {
                (this.form.get("tips") as FormGroup).controls[key].patchValue(settings.tips[key].enabled);
            });
        }));

    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onSave() {

        let changes = {
            sandbox: this.form.value.sandbox,
            general: this.getChanges("general"),
            footer: this.form.value.footer,
            tips: this.getChanges("tips"),
        }

        this.settingsService.update(changes);
        //this.navService.returnToSender();
        this.navService.goHome();
    }

    public onCancel() {
        //this.navService.returnToSender();
        this.navService.goHome();
    }

    public get tipKeys() {
        return Object.keys(this.settings.tips);
    }

    public get generalKeys() {
        return Object.keys(this.settings.general);
    }

    public onReset() {
        this.settingsService.factoryReset();
        this.navService.goHome();
        //this.navService.returnToSender();
    }

    private getChanges(groupKey: BooleanSettingsGroupKey): any {
        let result = {};

        Object.keys((this.form.controls[groupKey] as FormGroup).controls).forEach(key => {
            result[key] = { enabled: this.form.value[groupKey][key] };
        });
        return result;
    }
}
