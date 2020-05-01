import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { UpdatePublsihOptions, PublishOptionsUpdate } from 'src/app//modifiers/publish-options-modifiers/update-publish-options';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css']
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public sample: Clue[];
    public publishOptions: PublishOptionsUpdate = null;
    
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
    ) { }

    ngOnInit() {

        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                            this.sample = this.puzzle.clues.filter((c, i) => i < 3);
                            this.publishOptions = this.puzzle.publishOptions;
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("continue");
    }

    onBack() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("back");
    }

    onGrid() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("grid");
    }

}
