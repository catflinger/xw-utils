import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class UpdateTextColumn implements IPuzzleModifier {
    constructor(
        private index: number, 
        private caption: string) { }

    public exec(puzzle: PuzzleM) {
        let textCol = puzzle.publishOptions.textCols[this.index];

        if (textCol) {
            textCol.caption = this.caption;
        }
    }
}