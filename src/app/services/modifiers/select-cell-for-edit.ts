import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class SelectCellForEdit implements IPuzzleModifier {
    constructor(private cellId: string) { }

    exec(puzzle: PuzzleM) {
        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                let isTarget = (cell.id === this.cellId); 
                
                cell.highlight = isTarget;
                cell.edit = isTarget;
            });
        }
    }
}