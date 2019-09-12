import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { ClearSelection } from 'src/app/services/puzzle/reducers/clear-selection';
import { SelectClue } from 'src/app/services/puzzle/reducers/select-clue';
import { SelectNextClue } from 'src/app/services/puzzle/reducers/select-next-clue';
import { IActivePuzzle } from 'src/app/services/puzzle/puzzle-management.service';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private puzzleService: IActivePuzzle, 
        private router: Router) { }

    ngOnInit() {

        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.puzzleService.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
            ));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.router.navigate(["/publish-options"]);
    }

    onBack() {
        this.router.navigate(["/home"]);
    }

    onRowClick(clue: Clue) {
        this.puzzleService.update(new SelectClue(clue.id));
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.puzzleService.update(new ClearSelection());
        } else {
            this.puzzleService.update(new SelectNextClue(clue.id));
        }
    }
}
