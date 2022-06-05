import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class SetGridCaptions implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle.grid) {
            const grid = puzzle.grid;

            if (grid.properties.numbered) {
                grid.cells.forEach(cell => cell.caption = cell.anchor ? cell.anchor.toString() : null );
            }
        }
    }
}