import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';

export class UpdateTextColumn implements IPuzzleModifier {
    constructor(
        private index: number, 
        private caption: string) { }

    public exec(puzzle: IPuzzle) {
        let textCol = puzzle.publishOptions.textCols[this.index];

        if (textCol) {
            textCol.caption = this.caption;
        }
    }
}