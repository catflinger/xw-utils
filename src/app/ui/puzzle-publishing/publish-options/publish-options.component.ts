import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { UpdatePublsihOptions, PublishOptionsUpdate } from 'src/app//modifiers/publish-options-modifiers/update-publish-options';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { UpdatePublsihOptionTextStyle } from 'src/app/modifiers/publish-options-modifiers/update-publish-option-text-style';
import { fifteenSquaredBlack, fifteenSquaredBlue } from '../../common';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public publishOptions: PublishOptionsUpdate = null;
    
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;
            this.detRef.detectChanges();
        }));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                            this.publishOptions = this.puzzle.publishOptions;
                        }
                        this.detRef.detectChanges();
                    }
                )
            );
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("continue");
    }

    public onBack() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("back");
    }

    public onGrid() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        this.navService.navigate("grid");
    }

    public onChange() {
        this.activePuzzle.updateAndCommit(new UpdatePublsihOptions(this.publishOptions));
        //this.detRef.detectChanges();
    }

    public onUseDefaultChange(event: any) {
        if (event.target.checked) {
            this.publishOptions
            this.activePuzzle.updateAndCommit(
                new UpdatePublsihOptionTextStyle("clue", fifteenSquaredBlue, false, false, false),
                new UpdatePublsihOptionTextStyle("definition", fifteenSquaredBlue, false, false, true),
                new UpdatePublsihOptionTextStyle("answer", fifteenSquaredBlack, true, false, false),
            );
        }
    }

}
