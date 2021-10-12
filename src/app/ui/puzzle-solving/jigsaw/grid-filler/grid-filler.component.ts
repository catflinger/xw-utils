import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { AppService } from '../../../general/app.service';
import { JigsawEvent, JigsawService } from 'src/app/services/puzzles/jigsaw.service';
import { auditTime } from 'rxjs/operators';
import { Jigsaw } from '../jigsaw-model';

@Component({
    selector: 'app-grid-filler',
    templateUrl: './grid-filler.component.html',
    styleUrls: ['./grid-filler.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFillerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public appSettings: AppSettings = null;
    public puzzle: Puzzle = null;
    public event: JigsawEvent = null;

    constructor(
        private appService: AppService,
        private navService: NavService < AppTrackData >,
        private activePuzzle: IActivePuzzle,
        private jigsawService: JigsawService,
        private appSettingsService: AppSettingsService,
        private changeRef: ChangeDetectorRef,
    ) { }
    
        public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            const observer: Observable<[Puzzle, AppSettings]> = combineLatest([
                this.activePuzzle.observe(),
                this.appSettingsService.observe()]);

            this.subs.push(
                observer.subscribe(
                    (result) => {
                        const puzzle = result[0];
                        const appSettings = result[1];

                        if (puzzle && appSettings) {
                            if (!puzzle.solveable) {
                                this.appService.setAlert("danger", "Cannot open this puzzle in grid filler: the puzzle is missing either clues or a grid");
                                this.navService.goHome();
                            }
                            //this.scratchpad = puzzle;
                            this.appSettings = appSettings;
                            this.puzzle = puzzle;
                            this.jigsawService.usePuzzle(puzzle);
                        }

                        this.changeRef.detectChanges();
                    }
                ));

                this.subs.push(
                    this.jigsawService.observe()
                    .pipe(
                        auditTime(100)
                    )
                    .subscribe(event => {
                        this.event = event;
                        this.changeRef.detectChanges();
                    })
                )
        }
    }

    public ngOnDestroy(){
        this.jigsawService.stop();
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onBack() {
        //this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    public onSave() {
        //this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    public onStop() {
        this.jigsawService.stop();
    }

    public onStartFill() {
        this.jigsawService.start();
    }

}
