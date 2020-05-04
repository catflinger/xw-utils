import { IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class UpdatePuzzleOptions implements IPuzzleModifier {
    constructor(
        private setGridRefsFromCaptions: boolean
    ) { }

    public exec(puzzle: IPuzzle) {
        puzzle.options.setGridRefsFromCaptions = this.setGridRefsFromCaptions;
    }
}