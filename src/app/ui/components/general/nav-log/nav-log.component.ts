import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavService } from '../../../../services/navigation/nav.service';
import { AppTrackData } from '../../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-nav-log',
    templateUrl: './nav-log.component.html',
    styleUrls: ['./nav-log.component.css']
  })
  export class NavLogComponent implements OnInit, OnDestroy {
    public navHistory: ReadonlyArray<string> = [];

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        ) {
    }

    public ngOnInit() {
        this.subs.push(this.navService.observe().subscribe(log => this.navHistory = log));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
}
