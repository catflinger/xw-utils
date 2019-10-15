import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/ui/services/app.service';
import { AppSettings } from 'src/app/services/common';

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
            showCommentEditor: [this.settings.showCommentEditor],
            username: [this.settings.username],
            tips: this.formBuilder.group({}),
        });

        Object.keys(this.settings.tips).forEach(key => {
            (this.form.controls["tips"] as FormGroup).addControl(key, new FormControl(this.settings.tips[key].enabled));
        });

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings;

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
            showCommentEditor: this.form.value.showCommentEditor,
            tips: {
                general: { enabled: this.form.value.tips.general },
                definitionWarning: { enabled: this.form.value.tips.definitionWarning },
            }
        }
        this.settingsService.update(changes);
        this.appService.returnToSender();
    }

    public get tipKeys() {
        return Object.keys(this.settings.tips);
    }

    public onReset() {
        this.settingsService.factoryReset();
        this.appService.returnToSender();
    }

}
