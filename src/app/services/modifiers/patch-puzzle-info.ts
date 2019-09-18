import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class PatchPuzzleInfo implements IPuzzleModifier {
    constructor(
        private wordPressId:  number,
    ) { }

    exec(puzzle: PuzzleM) {
        if (this.wordPressId !== undefined) {
            puzzle.info.wordpressId = this.wordPressId;
        }
    }
}