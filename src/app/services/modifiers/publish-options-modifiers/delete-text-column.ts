import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class DeleteTextColumn implements IPuzzleModifier {
    constructor(private index: number) { }

    exec(puzzle: PuzzleM) {
        if (this.index > 0) {
            puzzle.publishOptions.textCols.splice(this.index, 1);
        }
    }
}