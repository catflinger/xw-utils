import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleM } from './mutable-model/puzzle-m';

export class ClearSelection implements IReducer {
    constructor() { }

    exec(puzzle: PuzzleM) {
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