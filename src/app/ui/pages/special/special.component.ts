import { Component, OnInit } from '@angular/core';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private navService: NavService,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.navService.gotoRoute(['/special-pdf']);
    }

    public onText() {
        this.navService.beginTrack("create-clues", null, new AppTrackData(null));
    }

    public onGridText() {
        this.navService.beginTrack("create-grid-clues", null, new AppTrackData(null));
    }

}
