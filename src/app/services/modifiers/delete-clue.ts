import { PuzzleM } from './mutable-model/puzzle-m';
import { IPuzzleModifier } from './puzzle-modifier';

export class DeleteClue implements IPuzzleModifier {
    constructor(
        private id: string,
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            let index = puzzle.clues.findIndex((c) => c.id === this.id);

            if (index >= 0) {
                puzzle.clues.splice(index, 1);
            }
        }
    }
}