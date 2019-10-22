import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AppService, AppStatus, OpenPuzzleParameters } from 'src/app/ui/services/app.service';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
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
        private activePuzzle: IActivePuzzle,
        private appService: AppService,
        private router: Router,
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
        this.activePuzzle.clear();
        this.appService.setOpenPuzzleParams(new OpenPuzzleParameters("openLatest", provider, null));
        this.router.navigate(["open-puzzle"]);
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

