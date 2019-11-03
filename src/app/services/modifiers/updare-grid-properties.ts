import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { GridProperties } from 'src/app/model/grid-properties';
import { GridStyle } from 'src/app/model/interfaces';
import { GridSize } from 'src/app/model/grid-size';

export class UpdateGridProperties implements IPuzzleModifier {
    constructor(
        public args: { style?: GridStyle, size?: GridSize, symmetrical?: boolean },
    ) { }

    exec(puzzle: PuzzleM) {
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