import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Direction } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { SelectClue } from 'src/app/services/reducers/select-clue';

@Component({
    selector: 'app-clue-list',
    templateUrl: './clue-list.component.html',
    styleUrls: ['./clue-list.component.css']
})
export class ClueListComponent implements OnInit {
    @Input() public direction: Direction;
    @Output() public clueClick = new EventEmitter<Clue>();

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

    public onClueClick(clue: Clue) {
        if (clue.highlight) {
            this.clueClick.emit(clue);
        } else {
            this.puzzleService.updatePuzzle(new SelectClue(clue.id));
        }
    }
}
