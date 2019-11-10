import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class MakeCellEditable implements IPuzzleModifier {
    constructor(private cellId: string) { }

    exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.grid) {
            puzzle.grid.cells.forEach(cell => {
                let isMatch = cell.id === this.cellId;
                cell.edit = isMatch;
            });
        }
    }
}