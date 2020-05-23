import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';

@Component({
    selector: 'app-puzzle-info',
    templateUrl: './puzzle-info.component.html',
    styleUrls: ['./puzzle-info.component.css']
})
export class PuzzleInfoComponent implements OnInit {

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
    ) { }

    ngOnInit(): void {
    }

    public onClose() {
        this.activePuzzle.commit();
        this.navService.navigate("continue");
    }

}
