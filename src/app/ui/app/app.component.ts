import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, AppStatus, EditorType } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { ApiSymbols } from 'src/app/services/common';
import { AuthService, Credentials } from 'src/app/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public credentials: Credentials;

    private subs: Subscription[] = [];

    constructor(
        private authService: AuthService,
        private puzzleManagementService: IPuzzleManager,
        private appService: AppService,
        private router: Router) {
    }

    public ngOnInit() {
        this.appService.clearBusy();
        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;

        }));
        this.subs.push(this.authService.observe().subscribe(credentials => {
            this.credentials = credentials;
        }));

        setInterval
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onArchive(provider: string) {
        this.router.navigate(["archive", provider]);
    }

    public onSolve(provider: string) {
        this.appService.clearAlerts();
        this.appService.setBusy();

        // TO DO: warn before clearing current puzzle

        this.puzzleManagementService.openLatestPuzzle(provider)
        .then((puzzle) => {
            let editor: EditorType = puzzle.solveable ? "solver" : "blogger";
            this.appService.setEditor(editor);
            this.navigate(editor);
        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clearBusy();
                this.appService.clearAlerts();
                this.appService.setAlert("danger", "You need to be logged in to load a new puzzle");
            } else {
                this.appService.clearBusy();
                this.appService.clearAlerts();
                this.appService.setAlert("danger", error.toString());
            }
        });
    }

    public onHome() {
        this.navigate("home");
    }

    public onLogin() {
        this.navigate("login");
    }

    public onLogout() {
        this.authService.clearCredentials();
        this.navigate("login");
    }

    private navigate (destination: string) {
        this.appService.clearBusy();
        this.appService.clearAlerts();
        this.router.navigate([destination])
    }
}

