import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class Clear implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle.clues) {
            puzzle.clues.forEach((clue) => {
                clue.highlight = false;
            });
        }

        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                cell.highlight = false;
                cell.edit = false;
            });
        }

    }
}