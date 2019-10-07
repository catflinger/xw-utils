import { IPuzzleModifier } from './puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';
import { ClearSelection } from './clear-selection';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdateCell implements IPuzzleModifier {
    constructor(
        public readonly cellId: string,
        public readonly shading: string,
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            
            let cell = puzzle.grid.cells.find((cell) => cell.id === this.cellId);
            if (cell) {
                cell.shading = this.shading;
            }
        }
    }
}