import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clear } from 'src/app/services/modifiers/clear';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { SelectClue } from 'src/app/services/modifiers/select-clue';
import { ClueListAction } from '../../components/clue-list-item/clue-list-item.component';
import { ClueTextEditorComponent } from '../../components/clue-text-editor/clue-text-editor.component';
import { DeleteClue } from 'src/app/services/modifiers/delete-clue';

@Component({
    selector: 'app-clues-editor',
    templateUrl: './clues-editor.component.html',
    styleUrls: ['./clues-editor.component.css']
})
export class CluesEditorComponent implements OnInit, OnDestroy {
    private modalRef: NgbModalRef = null;
    public puzzle: Puzzle = null;
    public acrossClues: ReadonlyArray<Clue> = [];
    public downClues: ReadonlyArray<Clue> = [];
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private modalService: NgbModal,
    ) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            if (!puzzle.capability.solveable) {
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            this.acrossClues = puzzle.clues.filter(c => c.group === "across");
                            this.downClues = puzzle.clues.filter(c => c.group === "down");
                        }
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("continue");
    }

    public onClueClick(clue: Clue) {
        if (!clue.highlight) {
            this.activePuzzle.update(new SelectClue(clue.id));
        }
    }

    public onAction(clue: Clue, action: ClueListAction) {
        if (action === "edit") {
            this.openEditor(clue);
        } else if (action === "delete") {
            // TO DO: prompt for confirmation first...
            this.activePuzzle.update(new DeleteClue(clue.id));
        }
    }

    public onEditorClose() {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

    public onAddClue() {
        this.openEditor(null);
    }

    private openEditor(clue) {
        setTimeout(
            () => {
                this.modalRef = this.modalService.open(ClueTextEditorComponent, { backdrop: "static" });
                this.modalRef.componentInstance.clue = clue;
                this.subs.push(this.modalRef.componentInstance.close.subscribe((result) => {
                    this.modalRef.close();
                    this.modalRef = null;
                }));
            },
            0
        );
    }


}

