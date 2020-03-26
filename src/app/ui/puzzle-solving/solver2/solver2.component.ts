import { Component, OnInit } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { GridCell } from 'src/app/model/grid-cell';
import { Clue } from 'src/app/model/clue';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { SelectClueByCell } from 'src/app/modifiers/clue-modifiers/select-clue-by-cell';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../../components/clue-editor/clue-editor.component';

@Component({
  selector: 'app-solver2',
  templateUrl: './solver2.component.html',
  styleUrls: ['./solver2.component.css']
})
export class Solver2Component implements OnInit {

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

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }
    
    public onContinue() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("continue");
    }

    public onBack() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("back");
    }

    public onCellClick(cell: GridCell) {
        if (!cell.highlight) {
            this.activePuzzle.update(new SelectClueByCell(cell.id));
        } else {
            let clue = this.puzzle.getSelectedClue();

            if (clue) {
                this.openEditor(this.puzzle, clue, null);
            }
        }
    }

    public onClueClick(clue: Clue) {
        this.openEditor(this.puzzle, clue, null);
    }

    private openEditor(puzzle: Puzzle, clue: Clue, starterText: string) {
        if (!clue.redirect) {
            setTimeout(
                () => {
                    this.modalRef = this.modalService.open(ClueEditorComponent, { 
                        backdrop: "static",
                        size: "lg",
                    });
                    this.modalRef.componentInstance.clueId = clue.id;
                    this.modalRef.componentInstance.starterText = starterText;

                    this.subs.push(this.modalRef.componentInstance.close.subscribe(
                        result => {
                            this.modalRef.close();
                            this.modalRef = null;
                        },
                        error => {
                            this.modalRef.close();
                            this.modalRef = null;
                        }
                    ));

                    // this.modalRef.result.finally(() => this.modalRef = null);
                },
                0
            );
        }
    }
}
