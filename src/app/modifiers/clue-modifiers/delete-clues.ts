import { IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class DeleteClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.clues = null;
        }
    }
}