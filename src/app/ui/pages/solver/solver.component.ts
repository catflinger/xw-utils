import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../../components/clue-editor/clue-editor.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { SelectClueByCell } from 'src/app/services/modifiers/select-clue-by-cell';
import { ClearSelection } from 'src/app/services/modifiers/clear-selection';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.css']
})
export class SolverComponent implements OnInit, OnDestroy {
    private modalRef: NgbModalRef = null;
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle, 
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (!puzzle.info.solveable) {
                            this.router.navigate(["home"]);
                        }
                        this.puzzle = puzzle;
                    }
            ));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
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

    onContinue() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/publish-options"]);
    }

    onClose() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/home"]);
    }

    onBlogger() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/blogger"]);
    }

    onClueClick(clue: Clue) {
        this.openEditor(clue, null);
    }

    onCellClick(cell: GridCell) {

        if (!cell.highlight) {
            this.activePuzzle.update(new SelectClueByCell(cell));
        } else {
            let clue = this.puzzle.getSelectedClue();

            if (clue) {
                this.openEditor(clue, null);
            }
        }
    }

    private openEditor(clue, starterText: string) {
        if (!clue.redirect) {
            setTimeout(
                () => {
                    this.modalRef = this.modalService.open(ClueEditorComponent, { backdrop: "static"});
                    this.modalRef.componentInstance.clueId = clue.id;
                    this.modalRef.componentInstance.starterText = starterText;
                    this.modalRef.componentInstance.latestAnswer = this.puzzle.getLatestAnswer(clue.id);
                    this.subs.push(this.modalRef.componentInstance.close.subscribe((result) => {
                        this.modalRef.close();
                        this.modalRef = null;
                    }));
                    // this.modalRef.result.finally(() => this.modalRef = null);
                },
                0
            );
        }
    }
}
