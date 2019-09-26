import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService, AppStatus } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiSymbols } from 'src/app/services/common';
import { Subscription } from 'rxjs';

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
    private subs: Subscription[] = [];

    @Input() public options: LoginControlOptions;
    @Output() public close:EventEmitter<string> = new EventEmitter();

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private builder: FormBuilder,
    ) { }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        this.appService.clearAlerts();

        this.form = this.builder.group({
            'username': ["", Validators.required],
            'password': ["", Validators.required],
        });
    }

    public onLogin() {
        this.appService.setBusy();
        this.appService.clearAlerts();
        
        this.authService.authenticate(
            this.form.value.username,
            this.form.value.password)
        .then(() => {
            this.appService.clearBusy();
            this.close.emit("OK");
        })
        .catch((error) => {
            this.appService.clearBusy();
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.setAlert("danger", "Username or password is incorrect");
            } else {
                this.appService.setAlert("danger", "Failed to connect to fifteensquared to verify the username and password");
            }
        });
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCancel() {
        this.close.emit("Cancel");
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
