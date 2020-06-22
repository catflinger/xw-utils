import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { AppResultSymbols, AppSettings } from 'src/app/services/common';
import { Subscription } from 'rxjs';
import { UIResult } from '../../common';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';

export interface LoginControlOptions {
    continueButtonText: string;
    cancelButtonText: string;
}

@Component({
    selector: 'app-login-control',
    templateUrl: './login-control.component.html',
    styleUrls: ['./login-control.component.css']
})
export class LoginControlComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public appStatus: AppStatus;
    public appSettings: AppSettings;
    private subs: Subscription[] = [];

    @Input() public options: LoginControlOptions;
    @Output() public close:EventEmitter<UIResult> = new EventEmitter();

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private builder: FormBuilder,
        private settingsService: AppSettingsService,
    ) { }

    public ngOnInit() {

        this.form = this.builder.group({
            'username': ["", Validators.required],
            'password': ["", Validators.required],
        });

        this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        this.appService.clearAlerts();

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.appSettings = settings;
            this.form.patchValue({username: settings.username});
        }));

    }

    public onLogin() {
        this.appService.setBusy();
        this.appService.clearAlerts();
        
        this.authService.authenticate(
            this.form.value.username,
            this.form.value.password)
        .then(result => {
            this.appService.clearBusy();

            switch (result) {
                case AppResultSymbols.OK:
                    this.close.emit("ok");
                    break;
                case AppResultSymbols.AuthorizationFailure:
                    this.appService.setAlert("danger", "Username or password is incorrect");
                    break;
                default:
                    this.appService.setAlert("danger", "Failed to connect to fifteensquared to verify the username and password");
            }
        });
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCancel() {
        this.close.emit("cancel");
    }

    public get continueButtonText() {
        if (this.options && this.options.continueButtonText) {
            return this.options.continueButtonText;
        }
        return "Continue";
    }

    public get cancelButtonText() {
        if (this.options && this.options.cancelButtonText) {
            return this.options.cancelButtonText;
        }
        return "Cancel";
    }
}
