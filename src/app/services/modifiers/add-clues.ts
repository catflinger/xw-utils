import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Clue } from 'src/app/model/clue';
import { AddPlaceholders } from './add-placeholders';

export class AddClues implements IPuzzleModifier {
    constructor(
        public args: { clues: ReadonlyArray<Clue> }
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (typeof this.args.clues !== "undefined") {
                puzzle.clues = JSON.parse(JSON.stringify(this.args.clues));
                puzzle.linked = false;

                new AddPlaceholders().exec(puzzle);
            }
        }
    }
}