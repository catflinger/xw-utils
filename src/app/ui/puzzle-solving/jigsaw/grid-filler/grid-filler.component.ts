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
import { UpdatePuzzleOptions } from 'src/app/modifiers/publish-options-modifiers/update-puzzle-options';
import { ClearGridReferences } from 'src/app/modifiers/clue-modifiers/clear-grid-references';
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';
import { IClue, IPuzzle, IGridCell } from 'src/app/model/interfaces';
import { ScratchpadService } from 'src/app/services/puzzles/scratchpad.service';


interface Light {
    readonly ref: GridReference,
    readonly cells: readonly IGridCell[]
};

@Component({
    selector: 'app-grid-filler',
    templateUrl: './grid-filler.component.html',
    styleUrls: ['./grid-filler.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFillerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    private counter = 0;
    private level = 0;
    private scratchpad: IPuzzle = null;
    
    public appSettings: AppSettings = null;
    public puzzle: Puzzle = null;

    constructor(
        private appService: AppService,
        private navService: NavService < AppTrackData >,
        private activePuzzle: IActivePuzzle,
        private scratchpadService: ScratchpadService,
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
                            this.scratchpadService.usePuzzle(puzzle);
                        }

                        this.changeRef.detectChanges();
                    }
                ));

                this.subs.push(
                    this.scratchpadService.observe().subscribe(scratchpad => {
                        this.scratchpad = scratchpad;
                        this.changeRef.detectChanges();
                    })
                )
        }
    }

        public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onBack() {
        //this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    public onClear() {
            this.scratchpadService.update(
            new Clear(),
            new UpdatePuzzleOptions("manual"),
            new ClearGridReferences(),
            new SyncGridContent(),
        );
    }

    public onStartFill() {
        this.counter = 0;

        this.placeNextWord();

        console.log("FINISHED count = " + this.counter);
        
        //this.navService.navigate("back");
    }

    private placeNextWord(): boolean {
        this.counter++;
        this.level++;

        if (this.counter > 10000) {
            return true;
        }

        const unplacedClues = this.getUnplacedClues();

        console.log(`Unpalced clues ${unplacedClues.length}`);
        let unplacedClue = unplacedClues.pop();

        while (unplacedClue) {
            const lights = this.getIncompleteLights();
            console.log(`Lights ${lights.length}`);

            let light = lights.pop();
            
            while (light) {

                if (this.testFit(unplacedClue, light)) {
                    // DO THE BUSINESS!
                    console.log("A");
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
                        console.log("B");
                        break;
                    }
                
                }
                
                light = lights.pop();
            }

            unplacedClue = unplacedClues.pop();
        }

        this.level--;

        return unplacedClues.length === 0;
    }

    private testFit(clue: IClue, light: Light): boolean {

        if (!clue.answers[0] || !light || light.cells.length === 0) {
            return false;
        }

        let answer = clue.answers[0].replace(/[^A-Z]/g, "");

        if (answer.length !== light.cells.length) {
            return false;
        }

        for(let i = 0; i < light.cells.length; i++) {
            if (light.cells[i].content && light.cells[i].content !== answer.substr(i, 1)) {
                return false;
            }
        }
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

        this.scratchpad.grid.cells
        .filter(c => c.anchor)
        .forEach(anchorCell => {
            result.push(this.getIncompleteAcrossLight(anchorCell));
            result.push(this.getIncompleteDownLight(anchorCell));
        });

        return result.filter(light => light);
    }

    private getIncompleteAcrossLight(anchorCell: IGridCell): Light {
        let result: Light = null;
        const grid = this.scratchpad.grid;
        const cells: IGridCell[] = [];

        let x = anchorCell.x;
        let y = anchorCell.y;
        let incompletes = 0;

        while (x < grid.properties.size.across) {
            let cell = grid.cells.find(c => c.y === y && c.x === x);
            cells.push(cell);

            // TO DO: make this work for barred grids too...

            if (!cell.light) {
                break;
            } else if (!cell.content) {
                incompletes++;
            }

            x++;
        }

        if (incompletes > 0) {
            result = {
                ref: {
                    id: null,
                    anchor: anchorCell.anchor,
                    direction: "across"
                },
                cells
            }
        }

        return result;
    }

    private getIncompleteDownLight(anchorCell: IGridCell): Light {
        let result: Light = null;
        const grid = this.scratchpad.grid;
        const cells: IGridCell[] = [];

        let x = anchorCell.x;
        let y = anchorCell.y;
        let incompletes = 0;

        while (y < grid.properties.size.down) {
            let cell = grid.cells.find(c => c.y === y && c.x === x);
            cells.push(cell);

            // TO DO: make this work for barred grids too...

            if (!cell.light) {
                break;
            } else if (!cell.content) {
                incompletes++;
            }

            y++;
        }

        if (incompletes > 0) {
            result = {
                ref: {
                    id: null,
                    anchor: anchorCell.anchor,
                    direction: "down"
                },
                cells
            }
        }

        return result;
    }

}
