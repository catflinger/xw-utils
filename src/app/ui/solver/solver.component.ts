import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../clue-editor/clue-editor.component';
import { Clue, GridCell } from 'src/app/model/puzzle';
import { ClueUpdate } from 'src/app/services/clue-update';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.css']
})
export class SolverComponent implements AfterViewInit {

    constructor(private puzzleService: PuzzleService, private modalService: NgbModal) { }

    ngAfterViewInit() {
        setTimeout(() => this.puzzleService.loadPuzzle("abc"), 0);
    }

    onClueClick(clue: Clue) {
        // to do: display modal here
        const modalRef = this.modalService.open(ClueEditorComponent);
        modalRef.componentInstance.clue = clue;
        
        modalRef.result
        .then((result: ClueUpdate) => {
            this.puzzleService.updateClue(clue.id, result);
        })
        .catch((error) => {
        });
    }

    onCellClick(cell: GridCell) {
        let clue = this.puzzleService.getSelectedClue();

        if (clue) {
            const modalRef = this.modalService.open(ClueEditorComponent);
            modalRef.componentInstance.clue = clue;
            }
    }
}
