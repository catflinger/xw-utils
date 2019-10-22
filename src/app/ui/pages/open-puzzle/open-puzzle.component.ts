import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus, EditorType, OpenPuzzleParameters } from '../../services/app.service';
import { Router } from '@angular/router';
import { AuthService, Credentials } from 'src/app/services/auth.service';
import { PuzzleManagementService } from 'src/app/services/puzzle-management.service';
import { ApiSymbols } from 'src/app/services/common';
import { UIResult } from '../../common';

@Component({
  selector: 'app-open-puzzle',
  templateUrl: './open-puzzle.component.html',
  styleUrls: ['./open-puzzle.component.css']
})
export class OpenPuzzleComponent implements OnInit, OnDestroy {
    //public appStatus: AppStatus;
    public credentials: Credentials;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private puzzleManagementService: PuzzleManagementService,
        private router: Router,
        ) { }

    public ngOnInit() {
        this.appService.clear();

        let params = this.appService.openPuzzleParameters;
        //this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!params) {
            this.router.navigate(["/home"]);
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
            this.router.navigate(["/home"]);
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    private openPuzzle(params: OpenPuzzleParameters) {
        this.appService.setBusy();
        this.puzzleManagementService.openLatestPuzzle(params.provider)
        .then((puzzle) => {
            this.appService.clear();
            this.appService.clearOpenPuzzleParams();
            let editor: EditorType = puzzle.solveable ? "solver" : "blogger";
            this.appService.setEditor(editor);
            this.router.navigate([editor]);
        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.authService.clearCredentials();
                this.appService.setAlert("danger", "Username or password is incorrect.  Please try to login again.");
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", error.toString());
            }
        });
    }

}
