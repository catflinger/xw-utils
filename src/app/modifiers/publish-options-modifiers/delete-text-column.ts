import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class DeleteTextColumn implements IPuzzleModifier {
    constructor(private index: number) { }

    exec(puzzle: IPuzzle) {
        if (this.index > 0) {
            puzzle.publishOptions.textCols.splice(this.index, 1);
        }
    }
}