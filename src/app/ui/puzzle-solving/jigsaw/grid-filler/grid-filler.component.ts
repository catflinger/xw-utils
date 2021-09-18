import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { AppService } from '../../../general/app.service';

@Component({
    selector: 'app-grid-filler',
    templateUrl: './grid-filler.component.html',
    styleUrls: ['./grid-filler.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFillerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public puzzle: Puzzle = null;
    public appSettings: AppSettings = null;
    
    constructor(
        private appService: AppService,
        private navService: NavService < AppTrackData >,
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private detRef: ChangeDetectorRef,
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
                                this.appService.setAlert("danger", "Cannot open this puzzle in solver: the puzzle is missing either clues or a grid");
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            this.appSettings = appSettings;
                        }

                        this.detRef.detectChanges();
                    }
                ));
        }
    }

        public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onBack() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    public onStartFill() {
        //this.activePuzzle.updateAndCommit(new Clear());
        //this.navService.navigate("back");
    }

}
