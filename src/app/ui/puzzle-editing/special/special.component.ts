import { Component, OnInit } from '@angular/core';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.navService.beginTrack("createPdfTrack", new AppTrackData());
    }

    public onText() {
        this.appService.setOpenPuzzleParams({
            provider: "text",
        });
        this.navService.beginTrack("createTextTrack", new AppTrackData());
    }

    public onGridText() {
        this.appService.setOpenPuzzleParams({
            provider: "text",
        });
        this.navService.beginTrack("createGridAndTextTrack", new AppTrackData());
    }
}
