import { Component, OnInit, Input } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Direction, Clue } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-clue-list',
    templateUrl: './clue-list.component.html',
    styleUrls: ['./clue-list.component.css']
})
export class ClueListComponent implements OnInit {
    @Input() public direction: Direction;
    private subs: Subscription[] = [];
    public clues: Clue[] = [];

    constructor(private puzzleService: PuzzleService) { }

    ngOnInit() {
        this.subs.push(this.puzzleService.getObservable().subscribe(
            (puzzle) => {
                if (puzzle) {
                    this.clues = puzzle.clues.filter((clue) => clue.group === this.direction)
                }
            }
        ));
    }

    public onClueClick(clueId: string) {
        this.puzzleService.selectClue(clueId);
    }
}
