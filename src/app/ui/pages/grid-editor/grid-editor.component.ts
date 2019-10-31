import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { ClearSelection } from 'src/app/services/modifiers/clear-selection';

@Component({
    selector: 'app-grid-editor',
    templateUrl: './grid-editor.component.html',
    styleUrls: ['./grid-editor.component.css']
})
export class GridEditorComponent implements OnInit {
    // private modalRef: NgbModalRef = null;
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        // private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    // @HostListener('document:keypress', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     if (this.puzzle && !this.modalRef) {
    //         if (event.key === "Enter") {
    //             event.stopPropagation();
    //             let clue = this.puzzle.getSelectedClue();
    //             if (clue) {
    //                 this.openEditor(clue, null);
    //             }
    //         } else if (/[a-zA-Z]/.test(event.key)) {
    //             event.stopPropagation();
    //             let clue = this.puzzle.getSelectedClue();
    //             if (clue) {
    //                 this.openEditor(clue, event.key);
    //             }
    //         }
    //     }
    // }

    onContinue() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/home"]);
    }

    onClose() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/home"]);
    }

    onCellClick(cell: GridCell) {
        // if (!cell.highlight) {
        //     this.activePuzzle.update(new SelectClueByCell(cell));
        // } else {
        //     let clue = this.puzzle.getSelectedClue();

        //     if (clue) {
        //         this.openEditor(clue, null);
        //     }
        // }
    }
}
