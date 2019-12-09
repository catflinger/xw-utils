import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, OpenPuzzleParamters } from '../../services/app.service';
import { Router } from '@angular/router';
import { AuthService, Credentials } from 'src/app/services/auth.service';
import { PuzzleManagementService } from 'src/app/services/puzzle-management.service';
import { ApiSymbols } from 'src/app/services/common';
import { UIResult } from '../../common';
import { NavService, EditorType } from '../../navigation/nav.service';
import { PublishingTrackData } from '../../navigation/tracks/publish-post-track';

@Component({
  selector: 'app-open-puzzle',
  templateUrl: './open-puzzle.component.html',
  styleUrls: ['./open-puzzle.component.css']
})
export class OpenPuzzleComponent implements OnInit, OnDestroy {
    public credentials: Credentials;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService,
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
            let action: string = puzzle.info.solveable ? "solve" : "blog";
            let editor: EditorType = puzzle.info.solveable ? "solver" : "blogger";

            this.appService.clear();
            this.appService.clearOpenPuzzleParams();

            const appData: PublishingTrackData = this.navService.navContext.appData;

            appData.editor = editor;
            this.navService.goNext(action);
        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
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
