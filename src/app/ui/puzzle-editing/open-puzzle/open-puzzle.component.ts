import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, OpenPuzzleParamters } from '../../general/app.service';
import { AuthService, Credentials } from 'src/app/services/app/auth.service';
import { PuzzleManagementService } from 'src/app/services/puzzles/puzzle-management.service';
import { AppResultSymbols } from 'src/app/services/common';
import { UIResult } from '../../common';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
  selector: 'app-open-puzzle',
  templateUrl: './open-puzzle.component.html',
  styleUrls: ['./open-puzzle.component.css']
})
export class OpenPuzzleComponent implements OnInit, OnDestroy {
    public credentials: Credentials;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private authService: AuthService,
        private puzzleManagementService: PuzzleManagementService,
        ) { }

    public ngOnInit() {
        this.appService.clear();

        let params = this.appService.openPuzzleParameters;

        if (!params) {
            this.navService.goHome();
        }
        
        this.subs.push(this.authService.observe().subscribe(credentials => {
            this.credentials = credentials;
            if (credentials.authenticated) {
                this.openPuzzle(params);
            }
        }));
    }

    public onLoginClose(result: UIResult) {
        if (result !== "ok") {
            this.navService.goHome();
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    private openPuzzle(params: OpenPuzzleParamters) {
        this.appService.setBusy();

        this.puzzleManagementService.openArchivePuzzle(params).then((puzzle) => {

            this.appService.clear();
            this.appService.clearOpenPuzzleParams();

            if (puzzle.info.provider === "ft" || puzzle.info.provider === "azed" ) {
                this.navService.navigate("parse");
            } else {
                this.navService.navigate("continue");
            }
        })
        .catch((error) => {
            if (error === AppResultSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.authService.clearCredentials();
                this.appService.setAlert("danger", "Username or password is incorrect.  Please try to login again.");
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", error && error.message ? error.message : error.toString());
            }
        });
    }
}
