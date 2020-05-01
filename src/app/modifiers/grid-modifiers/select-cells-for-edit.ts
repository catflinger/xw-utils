import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';
import { GridCell } from 'src/app/model/grid-cell';

export class SelectCellsForEdit implements IPuzzleModifier {
    constructor(private cells: GridCell[]) { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.grid) {
            puzzle.grid.cells.forEach(cell => {
                cell.highlight = !!this.cells.find(c => c.id === cell.id);
            });
        }
    }
}