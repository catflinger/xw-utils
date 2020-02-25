import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class ClearShading implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                cell.shading = null;
            });
        }

    }
}