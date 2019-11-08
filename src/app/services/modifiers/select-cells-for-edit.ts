import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { GridCell } from 'src/app/model/grid-cell';

export class SelectCellsForEdit implements IPuzzleModifier {
    constructor(private cells: GridCell[]) { }

    exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.grid) {
            puzzle.grid.cells.forEach(cell => {
                cell.highlight = !!this.cells.find(c => c.id === cell.id);
            });
        }
    }
}