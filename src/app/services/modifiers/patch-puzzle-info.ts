import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class PatchPuzzleInfo implements IPuzzleModifier {
    constructor(
        private args: { wordPressId?:  number, source?: string },
    ) { }

    exec(puzzle: PuzzleM) {
        if (this.args.wordPressId !== undefined) {
            puzzle.info.wordpressId = this.args.wordPressId;
        }
        if (this.args.source !== undefined) {
            puzzle.info.source = this.args.source;
        }
    }
}