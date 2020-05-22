import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService } from '../../general/app.service';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';

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
        this.navService.beginTrack("createPdfTrack", {});
    }

    public onLocal() {
        this.navService.beginTrack("createPuzzleTrack", { provider: "local"});
    }
}
