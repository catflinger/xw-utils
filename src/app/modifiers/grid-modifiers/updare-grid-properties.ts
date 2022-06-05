import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, GridStyle } from '../../model/interfaces';
import { GridSize } from 'src/app/model/puzzle-model/grid-size';

export class UpdateGridProperties implements IPuzzleModifier {
    constructor(
        public args: { style?: GridStyle, size?: GridSize, symmetrical?: boolean, numbered?: boolean, showCaptions?: boolean },
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
                if (this.args.numbered !== undefined) {
                    puzzle.grid.properties.numbered = this.args.numbered;
                }
                if (this.args.showCaptions !== undefined) {
                    puzzle.grid.properties.showCaptions = this.args.showCaptions;
                }
            }
        }
    }
}