import { Component, OnInit } from '@angular/core';
import { AppStatus, AppService } from '../../general/app.service';
import { AppSettings } from 'src/app/services/common';
import { Subscription } from 'rxjs';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { UIResult } from '../../common';

@Component({
  selector: 'app-special-login',
  templateUrl: './special-login.component.html',
  styleUrls: ['./special-login.component.css']
})
export class SpecialLoginComponent implements OnInit {
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

    public onLoginClose(result: UIResult) {
        this.navService.navigate(result);
    }

}
