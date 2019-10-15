import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSettingsService, AppSettings, BooleanSettingsGroupKey } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/ui/services/app.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
    public settings: AppSettings;

    private subs: Subscription[] = [];
    private form: FormGroup;

    constructor(
        private appService: AppService,
        private settingsService: AppSettingsService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {

        this.settings = this.settingsService.settings;

        this.form = this.formBuilder.group({
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

            Object.keys(this.settings.general).forEach(key => {
                (this.form.controls["general"] as FormGroup).controls[key].patchValue(settings.general[key].enabled);
            });

            Object.keys(this.settings.tips).forEach(key => {
                (this.form.controls["tips"] as FormGroup).controls[key].patchValue(settings.tips[key].enabled);
            });
        }));

    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onSave() {
        let changes = {
            general: this.xxxxx("general"),
            tips: this.xxxxx("tips"),
        }
        this.settingsService.update(changes);
        this.appService.returnToSender();
    }

    public get tipKeys() {
        return Object.keys(this.settings.tips);
    }

    public get generalKeys() {
        return Object.keys(this.settings.general);
    }

    public onReset() {
        this.settingsService.factoryReset();
        this.appService.returnToSender();
    }

    private xxxxx(groupKey: BooleanSettingsGroupKey): any {
        let result = {};

        Object.keys((this.form.controls[groupKey] as FormGroup).controls).forEach(key => {
            result[key] = { enabled: this.form.value[groupKey][key] };
        });
        return result;
        // {
        //     showCommentEditor: { enabled: this.form.value.general.showCommentEditor },
        //     showCheat: { enabled: this.form.value.general.showCheat },
        // }
    }
}
