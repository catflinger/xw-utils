import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService, AppStatus } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    public preview: string = "";
    public appStatus: AppStatus;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private router: Router,
        ) { }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onLoginClose() {
        if (this.appStatus.loginCallback) {
            this.appStatus.loginCallback();
        } else {
            this.appService.clear();
            this.router.navigate(["home"]);
        }
    }

}
