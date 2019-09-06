import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../clue-editor/clue-editor.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';

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
        private puzzleService: PuzzleService, 
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {

        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.puzzleService.getObservable().subscribe(
                    (puzzle) => {
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
        this.router.navigate(["/publish-options"]);
    }

    onBack() {
        this.router.navigate(["/home"]);
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
