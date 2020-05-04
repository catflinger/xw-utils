import { IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class DeleteClue implements IPuzzleModifier {
    constructor(
        private id: string,
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            let index = puzzle.clues.findIndex((c) => c.id === this.id);

            if (index >= 0) {
                puzzle.clues.splice(index, 1);
            }
        }
    }
}