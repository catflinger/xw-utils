import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { AppSettingsService, AppSettings } from 'src/app/services/app-settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    public preview: string = "";
    public appStatus: AppStatus;
    public settings: AppSettings;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private router: Router,
        public settingsService: AppSettingsService,
        ) { 
            this.settings = this.settingsService.settings;
        }

    public ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onLoginClose() {
        if (this.appService.loginCallback) {
            this.appService.loginCallback();
        } else {
            this.appService.clear();
            this.router.navigate(["home"]);
        }
    }

}
