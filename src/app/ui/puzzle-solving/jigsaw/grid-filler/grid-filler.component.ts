import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { AppService } from '../../../general/app.service';
import { UpdatePuzzleOptions } from 'src/app/modifiers/publish-options-modifiers/update-puzzle-options';
import { ClearGridReferences } from 'src/app/modifiers/clue-modifiers/clear-grid-references';
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { IClue, IPuzzle } from 'src/app/model/interfaces';
import { setUncaughtExceptionCaptureCallback } from 'process';


interface Light {
    readonly ref: GridReference,
    readonly cells: readonly GridCell[]
};

@Component({
    selector: 'app-grid-filler',
    templateUrl: './grid-filler.component.html',
    styleUrls: ['./grid-filler.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFillerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private scratchpad: IPuzzle;

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

    public onClear() {
        this.activePuzzle.updateAndCommit(
            new Clear(),
            new UpdatePuzzleOptions("manual"),
            new ClearGridReferences(),
            new SyncGridContent()
        );
    }

    public onStartFill() {
        //this.activePuzzle.update(new ClearGridReferences());
        //timer
        this.placeNextWord();
        
        //this.navService.navigate("back");
    }

    private placeNextWord(): boolean {
        const unplacedClues = this.getUnplacedClues();

        let unplacedClue = unplacedClues.pop();

        while (unplacedClue) {
            const lights = this.getIncompleteLights();

            let light = lights.pop();
            
            while (light) {
                if (this.testFit(unplacedClue, light)) {
                    // DO THE BUSINESS!
                    
                    // 1. assign a grid ref to the clue
                    unplacedClue.link = {
                        warning: null,
                        gridRefs: [light.ref]
                    }

                    // 2. copy the answer into the grid
                    light.cells.forEach((cell, index) => {
                        this.scratchpad.grid.cells
                        .find(c => c.id === cell.id)
                        .content = unplacedClue.answers[0].charAt(index);
                    })

                    // 3. recursive call to carry on looking from here, 
                    //    break out if we have a success, if not just carry on trying
                    if (this.placeNextWord()) {
                        break;
                    }
                
                }
                
                light = lights.pop();
            }

            unplacedClue = unplacedClues.pop();
        }

        return unplacedClues.length === 0;
    }

    private testFit(clue: IClue, light: Light): boolean {
        if (clue) {
            // try and place the word in the grid
            const lights = this.getIncompleteLights();
            let found = false;
            let index = entries.length - 1;

            while (index >= 0 && !found) {
                if (this.answerFitsEntry(clue.answers[0], entries[index])) {
                    found = true;
                }
            }

            if (found) {
                //TO DO:
                
            }

        } else {
            // TO DO: finshed
        };

        return true;

    }

    private answerFitsEntry(answer: string, entry: Light): boolean {
        let ans = answer.replace(/[A-Z]/g, "");
        let ent = entry.cells.map(c => c.content.trim() ? c.content.trim() : "@").join();

        return ans.length > 0 &&
            ent.length > 0 &&
            ans === ent;
    }

    private getUnplacedClues(): IClue[] {
        return this.scratchpad.clues
        .filter(c => c.link.gridRefs.length === 0 && c.answers[0].length);
    }


    private getIncompleteLights(): Light[] {

        const result: Light[] = [];
        const maxAnchor = this.scratchpad.grid.getMaxAnchor();

        for (let anchor = 1; anchor <= maxAnchor; anchor++) {
            const entry = this.puzzle.grid.getGridEntryFromReference({ id: null, anchor, direction: "across"});

            if (entry.filter(c => !c.content).length > 0) {
                result.push({
                    ref: {id: null, anchor, direction: "across"},
                    cells: entry
                });
            }
        }

        return result;
    }

}
