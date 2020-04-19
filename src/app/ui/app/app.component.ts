import { Component, OnInit, OnDestroy, Inject, DoCheck } from '@angular/core';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AuthService, Credentials } from 'src/app/services/app/auth.service';
import { NavService } from '../../services/navigation/nav.service';
import { AppTrackData } from '../../services/navigation/tracks/app-track-data';
import { Router, NavigationStart } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private navService: NavService<AppTrackData>,
        private authService: AuthService,
        private activePuzzle: IActivePuzzle,
        private appService: AppService,
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

        this.subs.push(this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.modalService.dismissAll();
            }
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
        this.appService.setOpenPuzzleParams({
            provider: "grid",
        });
        this.navService.beginTrack("createGridTrack", {});
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

