import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { ClueM } from './mutable-model/clue-m';
import { Clue } from 'src/app/model/clue';

export class AddClues implements IPuzzleModifier {
    constructor(
        public args: { clues: ReadonlyArray<Clue> }
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (typeof this.args.clues !== "undefined") {
                puzzle.clues = JSON.parse(JSON.stringify(this.args.clues));
                puzzle.linked = false;
            }
        }
    }
}