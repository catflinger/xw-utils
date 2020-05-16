import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { UpdateInfo } from 'src/app/modifiers/puzzle-modifiers/update-info';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { DeleteGrid } from 'src/app/modifiers/grid-modifiers/delete-grid';
import { DeleteClues } from 'src/app/modifiers/clue-modifiers/delete-clues';

@Component({
    selector: 'app-puzzle-hub',
    templateUrl: './puzzle-hub.component.html',
    styleUrls: ['./puzzle-hub.component.css'],
    changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PuzzleHubComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public puzzle: Puzzle = null;

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                            //console.log(JSON.stringify(this.puzzle, null, 2));
                        }
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public get acrossClues(): Clue[] {
        return this.puzzle.clues.filter(c => c.group === "across");
    }
    public get downClues(): Clue[] {
        return this.puzzle.clues.filter(c => c.group === "down");
    }

    public onEditInfo() {}

    public onEditClues() {
        this.navService.navigate("edit-clues");
    }

    public onDeleteClues() {
        this.activePuzzle.updateAndCommit(new DeleteClues());
    }

    public onDeleteGrid() {
        this.activePuzzle.updateAndCommit(new DeleteGrid());
    }

    public onEditGrid() {
        this.navService.navigate("edit-grid");
    }

    public onAddGrid() {
        this.navService.navigate("add-grid");
    }

    public onAddClues() {
        this.navService.navigate("add-clues");
    }

    public onMarkFinished() {
        this.activePuzzle.updateAndCommit(new UpdateInfo({
            ready: true,
            blogable: !!this.puzzle.clues,
            solveable: !!this.puzzle.clues && !!this.puzzle.grid,
            gridable: !!this.puzzle.grid,
        }));
        this.navService.goHome();
    }

    public onClose() {
        this.navService.goHome();
    }
}
