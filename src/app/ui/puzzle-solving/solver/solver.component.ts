import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle'; 
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/grid-cell';
import { Clue } from 'src/app/model/clue';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { SelectClueByCell } from 'src/app/modifiers/clue-modifiers/select-clue-by-cell';
import { ClueEditorService } from '../../components/editor/clue-editor.service';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolverComponent implements OnInit {

    public puzzle: Puzzle = null;
    public showEditor = false;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private editorService: ClueEditorService,
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
                        }
                    }
            ));
        }
    }
    
    @HostListener('window:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (this.puzzle && !this.editorService.isOpen) {
            if (event.key === "Enter") {
                event.stopPropagation();
                let clue = this.puzzle.getSelectedClue();
                if (clue) { 
                    this.openEditor();
                }
            } else if (event.key === "Escape") {
                event.stopPropagation();
                this.activePuzzle.updateAndCommit(new Clear());
            }
            // } else if (/^[a-zA-Z]$/.test(event.key)) {
            //     event.stopPropagation();
            //     let clue = this.puzzle.getSelectedClue();
            //     if (clue) {
            //         this.openEditor(event.key);
            //     }
            // }
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }
    
    public onContinue() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("continue");
    }

    public onBack() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }
    
    public onBlogger() {
        this.navService.navigate("blog");
    }
    
    public onCellClick(cell: GridCell) {
        if (!cell.highlight) {
            this.activePuzzle.updateAndCommit(new SelectClueByCell(cell.id));
        } else {
            let clue = this.puzzle.getSelectedClue();

            if (clue) {
                this.openEditor();
            }
        }
    }

    public onClueClick(clue: Clue) {
        this.openEditor();
    }

    public onEditorClose() {
        this.showEditor = false;
    }

    // private openEditor(clue: Clue) {
    //     this.editorService.open(clue.id);
    // }

    private openEditor() {
        if (!this.showEditor) {
            this.showEditor = true;
        }

        // let modalRef = this.modalService.open(ClueEditor2Component, { 
        //     backdrop: "static",
        //     size: "lg",
        // });
        
        //modalRef.componentInstance.close.subscribe(() => modalRef.close());
    }

}
