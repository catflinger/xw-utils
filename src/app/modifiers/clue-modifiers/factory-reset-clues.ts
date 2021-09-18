import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class FactoryResetClues implements IPuzzleModifier {
    constructor(
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.clues = [];
        }
    }
}