import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { AppService } from '../../services/app.service';
import { UpdateInfo } from 'src/app/services/modifiers/update-info';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private puzzleManager: IPuzzleManager,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.navService.beginTrack("createPdfTrack", new AppTrackData());
    }

    public onText() {
        this.puzzleManager.newPuzzle("text", [new UpdateInfo({blogable: true})]);
        this.navService.beginTrack("createTextTrack", new AppTrackData());
    }

    public onGridText() {
        this.appService.setOpenPuzzleParams({
            provider: "text",
        });
        this.navService.beginTrack("createGridAndTextTrack", new AppTrackData());
    }
}
