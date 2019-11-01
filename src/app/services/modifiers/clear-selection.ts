import { IPuzzleModifier } from './puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleM } from './mutable-model/puzzle-m';

export class ClearSelection implements IPuzzleModifier {
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
            });
        }

    }
}