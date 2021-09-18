import { GridLinkMethod, IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class UpdatePuzzleOptions implements IPuzzleModifier {
    constructor(
        private linkMethod: GridLinkMethod
    ) { }

    public exec(puzzle: IPuzzle) {
        puzzle.options.linkMethod = this.linkMethod;
    }
}