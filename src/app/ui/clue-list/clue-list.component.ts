import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Direction } from 'src/app/model/interfaces';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { SelectClue } from 'src/app/services/puzzle/reducers/select-clue';
import { IActivePuzzle } from 'src/app/services/puzzle/puzzle-management.service';

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

    constructor(private puzzleService: IActivePuzzle) { }

    ngOnInit() {
        this.subs.push(this.puzzleService.observe().subscribe(
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
            this.puzzleService.update(new SelectClue(clue.id));
        }
    }
}
