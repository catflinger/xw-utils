import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { UIResult } from '../../common';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-publish-login',
    templateUrl: './publish-login.component.html',
    styleUrls: ['./publish-login.component.css']
})
export class PublishLoginComponent implements OnInit {
    private subs: Subscription[] = [];
    public appStatus: AppStatus;
    public settings: AppSettings;

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private appService: AppService,
        private settingsService: AppSettingsService,
    ) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.settings = this.settingsService.settings;
            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        }
    }

    public onClose(result: UIResult) {
        const puzzle = this.activePuzzle.puzzle;

        this.appService.clear();
        if (result === "cancel" || result==="back") {
            this.navService.navigate("back");
        } else {
            this.navService.navigate("continue");
        }
    }
}
