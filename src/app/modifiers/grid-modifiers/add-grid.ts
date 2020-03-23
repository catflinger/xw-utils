import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { GridM } from '../mutable-model/grid-m';
import { Grid } from 'src/app/model/grid';

export class AddGrid implements IPuzzleModifier {
    constructor(
        public args: {grid: Grid}
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (typeof this.args.grid !== "undefined") {
                puzzle.grid = JSON.parse(JSON.stringify(this.args.grid));
                //puzzle.linked = false;
            }
        }
    }
}