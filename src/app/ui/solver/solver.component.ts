import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../clue-editor/clue-editor.component';
import { Clue, GridCell } from 'src/app/model/puzzle';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.css']
})
export class SolverComponent implements OnInit {
    private modalRef: NgbModalRef = null;
    public puzzle = null;

    constructor(private puzzleService: PuzzleService, private modalService: NgbModal) { }

    ngOnInit() {
        this.puzzleService.getObservable().subscribe(
            (puzzle) => {
                this.puzzle = puzzle;
            }
        );
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.puzzle && !this.modalRef) {
            if (event.key === "Enter") {
                event.stopPropagation();
                let clue = this.puzzle.getSelectedClue();
                if (clue) { 
                    this.openEditor(clue, null);
                }
            } else if (/[a-zA-Z]/.test(event.key)) {
                event.stopPropagation();
                let clue = this.puzzle.getSelectedClue();
                if (clue) {
                    this.openEditor(clue, event.key);
                }
            }
        }
    }

    onClueClick(clue: Clue) {
        this.openEditor(clue, null);
    }

    onCellClick(cell: GridCell) {
        let clue = this.puzzle.getSelectedClue();

        if (clue) {
            this.openEditor(clue, null);
        }
    }

    private openEditor(clue, starterText: string) {

        setTimeout(
            () => {
                this.modalRef = this.modalService.open(ClueEditorComponent);
                this.modalRef.componentInstance.clueId = clue.id;
                this.modalRef.componentInstance.starterText = starterText;
                this.modalRef.componentInstance.latestAnswer = this.puzzle.getLatestAnswer(clue.id);

                // this.modalRef.result.finally(() => this.modalRef = null);
            },
            0
        );
    }
}
