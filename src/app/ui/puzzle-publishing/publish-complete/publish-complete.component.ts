import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-publish-complete',
    templateUrl: './publish-complete.component.html',
    styleUrls: ['./publish-complete.component.css']
})
export class PublishCompleteComponent implements OnInit, OnDestroy {
    public puzzle = null;
    public username: string;
    public password: string;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle
    ) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        }
    }
    
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.navService.goHome();
    }

}
