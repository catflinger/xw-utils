import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AuthService, Credentials } from 'src/app/services/auth.service';
import { NavService } from '../navigation/nav.service';
import { AppTrackData } from '../navigation/tracks/app-track-data';

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

    public temp: string = "undefined";

    constructor(
        private navService: NavService<AppTrackData>,
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

        this.subs.push(this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                let context = this.navService.debugNavContext;

                this.temp = context ? 
                `${context.track.name}:${context.currentNode.name}` : 
                "none";
            };
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onArchive(provider: string) {
        this.activePuzzle.clear();
        this.appService.clear();
        //this.appService.navContext.clear();
        
        if (provider === "independent" || provider === "ios") {
            this.navService.gotoRoute(["indy"]);
        
        } else if (provider === "special" ) {
            this.navService.gotoRoute(["special"]);
        
        } else {
            this.navService.gotoRoute(["archive", provider]);
        }
    }

    public onGrid() {
        this.activePuzzle.clear();
        this.appService.clear();
        this.navService.beginTrack("create-grid", null, null);
    }

    public onHome() {
        this.navService.goHome();
    }

    public onGoTo(route: string) {
        this.appService.clear();
        this.navService.gotoRoute([route]);
    }

    public onLogout() {
        this.authService.clearCredentials();
        this.appService.clear();
        this.navService.gotoRoute(["login"])
    }
}

