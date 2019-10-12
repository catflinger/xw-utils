import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSettingsService, AppSettings } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        this.form = this.formBuilder.group({
            showTips: true
        });
        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings
            this.form.patchValue({
                showTips: settings.showTips
            });
        }));

    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onSave() {
        this.settingsService.showTips = this.form.value.showTips;
        this.appService.returnToSender();
    }
}
