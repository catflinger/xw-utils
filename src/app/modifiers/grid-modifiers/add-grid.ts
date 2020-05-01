import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class AddGrid implements IPuzzleModifier {
    constructor(
        public args: {grid: Grid}
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            if (typeof this.args.grid !== "undefined") {
                puzzle.grid = JSON.parse(JSON.stringify(this.args.grid));
                //puzzle.linked = false;
            }
        }
    }
}