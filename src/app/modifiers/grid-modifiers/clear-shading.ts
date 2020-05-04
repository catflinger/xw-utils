import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';

export class ClearShading implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                cell.shading = null;
            });
        }

    }
}