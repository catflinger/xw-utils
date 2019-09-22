import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiSymbols } from 'src/app/services/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    public appStatus: AppStatus;
    public preview: string = "";

    private subs: Subscription[] = [];

    constructor(
        private authService: AuthService,
        private appService: AppService,
        private router: Router,
        private builder: FormBuilder,
        ) { }

    public ngOnInit() {
   
        this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));

        this.form = this.builder.group({
            'username': ["", Validators.required],
            'password': ["", Validators.required],
        });
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onLogin() {
        this.appService.clearAlerts();
        this.appService.setBusy();

        this.authService.authenticate(
            this.form.value.username,
            this.form.value.password)
        .then(() => {
            this.appService.clearBusy();
            this.router.navigate(["home"]);
        })
        .catch((error) => {
            this.appService.clearBusy();
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.setAlert("danger", "Username or password incorrect");
            } else {
                this.appService.setAlert("danger", "Failed to login");
            }
        });

    }

    public onCancel() {
        this.router.navigate(["home"]);
    }

}
