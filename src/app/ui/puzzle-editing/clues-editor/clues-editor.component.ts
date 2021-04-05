import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { v4 as uuid } from "uuid";
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { SelectClue } from 'src/app//modifiers/clue-modifiers/select-clue';
import { AddClue } from 'src/app/modifiers/clue-modifiers/add-clue';
import { ClueGroup } from 'src/app/model/interfaces';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';

@Component({
    selector: 'app-clues-editor',
    templateUrl: './clues-editor.component.html',
    styleUrls: ['./clues-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CluesEditorComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public puzzle: Puzzle = null;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event && event.key === "Escape") {
            event.stopPropagation();
            Promise.resolve(() => {
                this.activePuzzle.updateAndCommit(new Clear());
                this.detRef.detectChanges();
            });
        }
    }

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
                            if (!puzzle.clues) {
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                        }
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onClueClick(clue: Clue) {
        
        if (!clue.highlight) {
            this.activePuzzle.updateAndCommit(new SelectClue(clue.id));
        }
    }

    public onAddClue(group: ClueGroup) {
        const id = uuid();
        const maxClueCaption = this.puzzle.getMaxClueCaption(group) + 1;

        this.activePuzzle.updateAndCommit(
            new AddClue(maxClueCaption.toString(), group, "New clue...", id),
            new SortClues(),
            new SelectClue(id)
        );
    }

    public onContinue() {
        this.navService.navigate("continue");
    }

}

