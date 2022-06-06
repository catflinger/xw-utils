import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { RenumberGid } from './renumber-grid';

export class SetGridCaptions implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle.grid) {

            if (puzzle.grid.properties.numbered) {
                puzzle.grid.cells.forEach(cell => cell.caption = cell.anchor ? cell.anchor.toString() : null );
            }
        }
    }
}