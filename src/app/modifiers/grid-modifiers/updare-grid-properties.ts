import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle, GridStyle } from '../../model3/interfaces';
import { GridSize } from 'src/app/model/grid-size';

export class UpdateGridProperties implements IPuzzleModifier {
    constructor(
        public args: { style?: GridStyle, size?: GridSize, symmetrical?: boolean },
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            if (this.args) {
                if (this.args.style) {
                    puzzle.grid.properties.style = this.args.style;
                }
                if (this.args.style) {
                    puzzle.grid.properties.size = this.args.size;
                }
                if (this.args.symmetrical !== undefined) {
                    puzzle.grid.properties.symmetrical = this.args.symmetrical;
                }
            }
        }
    }
}