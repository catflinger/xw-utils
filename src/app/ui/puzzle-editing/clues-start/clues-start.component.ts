import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-clues-start',
    templateUrl: './clues-start.component.html',
    styleUrls: ['./clues-start.component.css']
  })
  export class CluesStartComponent implements OnInit, OnDestroy {

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
    ) { }

    ngOnInit() {
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCancel() {
        this.navService.goHome();
    }

    public onText() {
        this.navService.navigate("text");
    }

    public onManual() {
        this.navService.navigate("auto");
    }

}
