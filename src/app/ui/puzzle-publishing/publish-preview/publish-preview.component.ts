import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';

@Component({
    selector: 'app-publish-preview',
    templateUrl: './publish-preview.component.html',
    styleUrls: ['./publish-preview.component.css']
})
export class PublishPreviewComponent implements OnInit {

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        }
    }

    public onClose() {
        this.navService.navigate("continue");
    }

}
