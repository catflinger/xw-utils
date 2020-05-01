import { IPuzzleModifier } from './puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';

export class MarkAsUncommitted implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.uncommitted = true;
        }

    }
}