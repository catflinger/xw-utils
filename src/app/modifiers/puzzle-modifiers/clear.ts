import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class Clear implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
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