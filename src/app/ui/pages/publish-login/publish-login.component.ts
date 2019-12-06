import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Router } from '@angular/router';
import { UIResult } from '../../common';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { AppSettings } from 'src/app/services/common';

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
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private appService: AppService,
        private settingsService: AppSettingsService,
    ) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.appService.goHome();
        } else {
            this.settings = this.settingsService.settings;
            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        }
    }

    public onClose(result: UIResult) {
        let route: string;
        const puzzle = this.activePuzzle.puzzle;
        const gridOnly = puzzle && puzzle.grid && !puzzle.clues;

        this.appService.clear();
        if (result === "cancel" || result==="back") {
            if (gridOnly) {
                route = "/grid-editor"
            } else {
                route = "/publish-preamble";
            }
        } else {
            route = "/publish";
        }
        this.router.navigate([route]);
    }
}
