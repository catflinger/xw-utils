import { IPuzzleModifier } from './puzzle-modifier';
import { ClueGroup } from 'src/app/model/interfaces';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Clue } from 'src/app/model/clue';
import { ClueBuffer } from '../parsing/text/clue-buffer';
import { SortClues } from './sort-clues';

export class AddClue implements IPuzzleModifier {
    constructor(
        private caption: string,
        private group: ClueGroup,
        private text: string,
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            let fullText = this.caption + " " + this.text;
            const cb: ClueBuffer = new ClueBuffer(fullText, this.group);

            const clue = Clue.makeClue(cb, this.group);
            puzzle.clues.push(clue.toMutable());
            new SortClues().exec(puzzle);
        }
    }
}