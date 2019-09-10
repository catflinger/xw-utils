import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { ClearSelection } from 'src/app/services/reducers/clear-selection';
import { SelectClue } from 'src/app/services/reducers/select-clue';
import { SelectNextClue } from 'src/app/services/reducers/select-next-clue';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private puzzleService: PuzzleService, 
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

    onContinue() {
        this.router.navigate(["/publish-options"]);
    }

    onBack() {
        this.router.navigate(["/home"]);
    }

    onRowClick(clue: Clue) {
        this.puzzleService.updatePuzzle(new SelectClue(clue.id));
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.puzzleService.updatePuzzle(new ClearSelection());
        } else {
            this.puzzleService.updatePuzzle(new SelectNextClue(clue.id));
        }
    }
}
