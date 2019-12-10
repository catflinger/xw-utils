import { Component, OnInit } from '@angular/core';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private puzzleManager: IPuzzleManager,
        private navService: NavService<AppTrackData>,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.navService.gotoRoute(['/special-pdf']);
    }

    public onText() {
        this.puzzleManager.newPuzzle();
        this.navService.beginTrack("create-clues", null, new AppTrackData("blogger"));
    }

    public onGridText() {
        this.puzzleManager.newPuzzle();
        this.navService.beginTrack("create-grid-clues", null, new AppTrackData("solver"));
    }

}
