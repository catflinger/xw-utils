import { IPuzzle } from '../../model3/interfaces';
import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';

export class UpdatePuzzleOptions implements IPuzzleModifier {
    constructor(
        private setGridRefsFromCaptions: boolean
    ) { }

    public exec(puzzle: IPuzzle) {
        puzzle.options.setGridRefsFromCaptions = this.setGridRefsFromCaptions;
    }
}