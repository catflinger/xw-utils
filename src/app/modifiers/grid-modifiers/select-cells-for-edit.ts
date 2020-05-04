import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';

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