import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class MarkAsCommitted implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            puzzle.uncommitted = false;
        }

    }
}