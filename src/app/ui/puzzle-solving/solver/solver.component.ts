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
import { ClueEditorService } from '../../components/editor/clue-editor.service';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css']
})
export class SolverComponent implements OnInit {

    public puzzle: Puzzle = null;

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
                this.openEditor(clue, null);
            }
        }
    }

    public onClueClick(clue: Clue) {
        this.openEditor(clue, null);
    }

    private openEditor(clue: Clue, starterText: string) {
        if (!clue.redirect) {
            this.editorService.open(clue.id, starterText);
        }
    }
}
