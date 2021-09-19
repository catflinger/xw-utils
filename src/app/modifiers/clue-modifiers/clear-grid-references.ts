import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class ClearGridReferences implements IPuzzleModifier {
    constructor() { }

    public exec(puzzle: IPuzzle) {

        puzzle.clues.forEach(clue => {
            clue.link.gridRefs = [];
        });
    }

}