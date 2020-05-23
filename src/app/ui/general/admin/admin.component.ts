import { Component, OnInit } from '@angular/core';
import { HttpPuzzleSourceService } from 'src/app/services/puzzles/http-puzzle-source.service';
import { AppService } from '../app.service';
import { ApiSymbols } from 'src/app/services/common';
import { AuthService } from 'src/app/services/app/auth.service';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private navService: NavService<AppTrackData>,
        private puzzleSource: HttpPuzzleSourceService,
    ) { }

    public ngOnInit(): void {
        if (!this.authService.getCredentials().authenticated) {
            this.appService.redirect = ["admin"];
            this.navService.gotoRoute(["login"]);
        }
    }

    public onHousekeep() {
        this.appService.clear();

        this.puzzleSource.housekeep()
        .then(() => {
            this.appService.setAlert("info", "Housekeep completed.");
        })
        .catch(error => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.setAlert("danger", "Authorisation failed");
            } else {
                this.appService.setAlert("danger", "Housekeep failed: " + error);
            }
        });
    }

}
