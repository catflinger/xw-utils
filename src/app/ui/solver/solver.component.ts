import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../clue-editor/clue-editor.component';
import { Clue, GridCell } from 'src/app/model/puzzle';
import { ClueUpdate } from 'src/app/services/clue-update';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.css']
})
export class SolverComponent implements AfterViewInit {
    private modalRef: NgbModalRef = null;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.modalRef) {

            console.log("KEY=" + event.key);

            if (event.key === "Enter") {
                event.stopPropagation();
                let clue = this.puzzleService.getSelectedClue();
                if (clue) {
                    this.openEditor(clue, null);
                }
            } else if (/[a-zA-Z]/.test(event.key)) {
                event.stopPropagation();
                let clue = this.puzzleService.getSelectedClue();
                if (clue) {
                    this.openEditor(clue, event.key);
                }
            }
        }
    }

    constructor(private puzzleService: PuzzleService, private modalService: NgbModal) { }

    ngAfterViewInit() {
        setTimeout(() => this.puzzleService.loadPuzzle("abc"), 0);
    }

    onClueClick(clue: Clue) {
        this.openEditor(clue, null);
    }

    onCellClick(cell: GridCell) {
        let clue = this.puzzleService.getSelectedClue();

        if (clue) {
            this.openEditor(clue, null);
        }
    }

    private openEditor(clue, starterText: string) {
        setTimeout(() => {
            this.modalRef = this.modalService.open(ClueEditorComponent);
            this.modalRef.componentInstance.clue = clue;
            this.modalRef.componentInstance.starterText = starterText;

            this.modalRef.result
                .then((result: ClueUpdate) => {
                    if (result) {
                        this.puzzleService.updateClue(clue.id, result);
                    }
                })
                .catch((error) => {
                })
                .finally(() => this.modalRef = null);
            },
            0
        );
    }
}
