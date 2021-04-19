import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { ClueDialogService } from '../../puzzle-editing/tabbed-dialogs/clue-dialog.service';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { SelectClue } from 'src/app/modifiers/clue-modifiers/select-clue';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { ClueGroup } from 'src/app/model/interfaces';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { HousekeepClues } from 'src/app/modifiers/clue-modifiers/housekeep-clues';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';

@Component({
  selector: 'app-clue-edit-list',
  templateUrl: './clue-edit-list.component.html',
  styleUrls: ['./clue-edit-list.component.css']
})
export class ClueEditListComponent implements OnInit {
    private subs: Subscription[] = [];

    @Input() group: ClueGroup = "across";
    
    public puzzle: Puzzle = null;
    public clues: ReadonlyArray<Clue> = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private editorService: ClueDialogService,
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
                            if (!puzzle.clues) {
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            this.clues = puzzle.clues.filter(c => c.group === this.group);
                        }
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.navService.navigate("continue");
    }

    public onClueClick(clue: Clue) {
        
        if (!clue.highlight) {
            this.activePuzzle.updateAndCommit(new SelectClue(clue.id));
        }
    }

    public onSaveEdit() {
        this.editorService.save()
        .then(cancel => {
            this.activePuzzle.updateAndCommit(
                new Clear(),
                new SortClues(),
                new SetGridReferences(),
                new SetRedirects(),
                );
            this.detRef.detectChanges();
            });
    }

    public onCancelEdit() {
        // housekeep removes any clues without any text 
        this.activePuzzle.updateAndCommit(
            new Clear(),
            new HousekeepClues());
    }

}

