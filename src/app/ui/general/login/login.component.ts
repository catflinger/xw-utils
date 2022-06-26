import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

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
        private navService: NavService<AppTrackData>,
        private appService: AppService,
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
        if (this.appService.redirect) {
            const route = this.appService.redirect;
            this.appService.redirect = null;
            this.navService.gotoRoute(route);
        } else {
            this.navService.goHome();
        }
    }

}
