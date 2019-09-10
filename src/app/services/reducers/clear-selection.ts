import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/puzzle';

export class ClearSelection implements IReducer {
    constructor() { }

    exec(puzzle: IPuzzle) {
        puzzle.clues.forEach((clue) => {
            clue.highlight = false;
        });

        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                cell.highlight = false;
            });
        }

    }
}