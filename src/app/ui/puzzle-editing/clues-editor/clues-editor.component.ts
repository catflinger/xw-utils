import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../../components/clue-editor/clue-editor.component';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { SelectClueByCell } from 'src/app/services/modifiers/select-clue-by-cell';
import { Clear } from 'src/app/services/modifiers/clear';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';

@Component({
    selector: 'app-clues-editor',
    templateUrl: './clues-editor.component.html',
    styleUrls: ['./clues-editor.component.css']
})
export class CluesEditorComponent implements OnInit, OnDestroy {
    private modalRef: NgbModalRef = null;
    public puzzle: Puzzle = null;
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
                            if (!puzzle.info.solveable) {
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            //console.log("CLUES_EDITOR " + JSON.stringify(puzzle));
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.activePuzzle.update(new Clear());
        this.navService.navigate("continue");
    }

    onClueClick(clue: Clue) {
        //this.openEditor(clue, null);
    }

    // private openEditor(clue, starterText: string) {
    //     if (!clue.redirect) {
    //         setTimeout(
    //             () => {
    //                 this.modalRef = this.modalService.open(ClueEditorComponent, { backdrop: "static" });
    //                 this.modalRef.componentInstance.clueId = clue.id;
    //                 this.modalRef.componentInstance.starterText = starterText;
    //                 this.subs.push(this.modalRef.componentInstance.close.subscribe((result) => {
    //                     this.modalRef.close();
    //                     this.modalRef = null;
    //                 }));
    //                 // this.modalRef.result.finally(() => this.modalRef = null);
    //             },
    //             0
    //         );
    //     }
    // }
}

