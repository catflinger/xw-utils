import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class AddGrid implements IPuzzleModifier {
    constructor(
        public args: {grid: Grid}
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            if (typeof this.args.grid !== "undefined") {
                puzzle.grid = this.args.grid;
            }
        }
    }
}