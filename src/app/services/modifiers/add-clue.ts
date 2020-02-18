import { IPuzzleModifier } from './puzzle-modifier';
import { ClueGroup } from 'src/app/model/interfaces';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Clue } from 'src/app/model/clue';
import { ClueBuffer } from '../parsing/text/clue-buffer';

export class AddClue implements IPuzzleModifier {
    constructor(
        private caption: string,
        private group: ClueGroup,
        private text: string,
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            const cb: ClueBuffer = new ClueBuffer(this.text, this.group);

            const clue = Clue.makeClue(cb, this.group);
            puzzle.clues.push(clue.toMutable());
        }
    }
}