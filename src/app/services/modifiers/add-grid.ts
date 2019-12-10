import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { GridM } from './mutable-model/grid-m';

export class AddGrid implements IPuzzleModifier {
    constructor(
        public args: {grid: GridM}
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (typeof this.args.grid !== "undefined") {
                puzzle.grid = this.args.grid;
                puzzle.linked = false;
            }
        }
    }
}