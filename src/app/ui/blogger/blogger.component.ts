import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { ClearSelection } from 'src/app/services/puzzle-management/modifiers/clear-selection';
import { SelectClue } from 'src/app/services/puzzle-management/modifiers/select-clue';
import { SelectNextClue } from 'src/app/services/puzzle-management/modifiers/select-next-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management/puzzle-management.service';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle, 
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
        this.activePuzzle.update(new SelectClue(clue.id));
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.activePuzzle.update(new ClearSelection());
        } else {
            this.activePuzzle.update(new SelectNextClue(clue.id));
        }
    }
}
