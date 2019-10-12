import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd, Event } from '@angular/router';
import { AppService, AppStatus, EditorType } from 'src/app/ui/services/app.service';
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
    public isNavbarCollapsed: boolean;

    private subs: Subscription[] = [];

    // TO DO: think about making this a stack so that returns can be be nested
    private currentRoute: string;

    constructor(
        private authService: AuthService,
        private puzzleManagementService: IPuzzleManager,
        private appService: AppService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        ) {
    }

    public ngOnInit() {
        
        this.appService.clearBusy();
        
        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;

        }));
        
        this.subs.push(this.authService.observe().subscribe(credentials => {
            this.credentials = credentials;
        }));

        this.subs.push(this.router.events.subscribe((x: Event) => {
            if (x instanceof NavigationEnd) {
                this.currentRoute = this.router.url;
            }
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onArchive(provider: string) {
        this.router.navigate(["archive", provider]);
    }

    public onSolve(provider: string) {
        this.appService.clear();

        if (!this.credentials.authenticated) {
            this.appService.setLoginCallback(() => {
                this.openPuzzle(provider);
            });
            this.router.navigate(["login"])

        } else {
            this.appService.setBusy();
            this.openPuzzle(provider);
        }
    }

    private openPuzzle(provider: string) {
        this.puzzleManagementService.openLatestPuzzle(provider)
        .then((puzzle) => {
            this.appService.clear();
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

    public onHome() {
        this.appService.clear();
        this.router.navigate(["home"])
    }

    public onLogin() {
        this.appService.clear();
        this.router.navigate(["login"])
    }

    public onLogout() {
        this.authService.clearCredentials();
        this.appService.clear();
        this.router.navigate(["login"])
    }

    public onSettings() {
        this.appService.setReturnAddress(this.currentRoute);
        this.router.navigate(["/settings"]);
    }
}

