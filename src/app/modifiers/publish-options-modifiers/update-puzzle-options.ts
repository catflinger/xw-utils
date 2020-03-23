import { PuzzleM } from '../mutable-model/puzzle-m';
import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';

export class UpdatePuzzleOptions implements IPuzzleModifier {
    constructor(
        private setGridRefsFromCaptions: boolean
    ) { }

    public exec(puzzle: PuzzleM) {
        puzzle.options.setGridRefsFromCaptions = this.setGridRefsFromCaptions;
    }
}