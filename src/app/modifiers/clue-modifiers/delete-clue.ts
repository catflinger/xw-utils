import { IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class DeleteClue implements IPuzzleModifier {
    constructor(
        private id: string,
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.clues = puzzle.clues.filter((c) => c.id !== this.id);
        }
    }
}