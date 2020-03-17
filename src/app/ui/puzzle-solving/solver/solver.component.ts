import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueAnnotationComponent } from '../../components/clue-annotator/clue-annotator.component';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { SelectClueByCell } from 'src/app//modifiers/clue-modifiers/select-clue-by-cell';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { ClearShading } from 'src/app//modifiers/grid-modifiers/clear-shading';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.css']
})
export class SolverComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;

    private modalRef: NgbModalRef = null;
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle, 
        private modalService: NgbModal,
    ) { }

    ngOnInit() {

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

                            //console.log("SOLVER " + JSON.stringify(puzzle.clues));
                        }
                    }
            ));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.puzzle && !this.modalRef) {
            if (event.key === "Enter") {
                event.stopPropagation();
                let clue = this.puzzle.getSelectedClue();
                if (clue) { 
                    this.openEditor(clue, null);
                }
            } else if (event.key === "Escape") {
                event.stopPropagation();
                this.activePuzzle.update(new Clear());
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
        this.activePuzzle.update(new Clear());
        this.navService.navigate("continue");
    }

    onBack() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("back");
    }

    onEdit() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("edit");
    }

    onBlogger() {
        this.navService.navigate("blog");
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
                    this.modalRef = this.modalService.open(ClueAnnotationComponent, { 
                        backdrop: "static",
                        size: "lg",
                    });
                    this.modalRef.componentInstance.clueId = clue.id;
                    this.modalRef.componentInstance.starterText = starterText;
                    this.modalRef.componentInstance.publishOptions = this.puzzle.publishOptions;
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
