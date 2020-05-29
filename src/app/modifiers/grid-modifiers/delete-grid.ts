import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class DeleteGrid implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.grid = null;
            if (puzzle.clues) {
                puzzle.clues.forEach( clue => {
                    clue.link.gridRefs = [];
                    clue.link.warning = null;
                });
            }
        }
    }
}