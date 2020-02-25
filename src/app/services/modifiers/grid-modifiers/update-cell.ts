import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';
import { Clear } from '../puzzle-modifiers/clear';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class UpdateCell implements IPuzzleModifier {
    constructor(
        public cellId: string,
        public args: {
            shading?: string,
            caption?: string,
            content?: string,
            light?: boolean,
            rightBar?: boolean,
            bottomBar?: boolean,
        }
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            
            let cell = puzzle.grid.cells.find((cell) => cell.id === this.cellId);
            if (cell) {
                if (this.args.shading !== undefined) {
                    cell.shading = this.args.shading;
                }
                if (this.args.caption !== undefined) {
                    cell.caption = this.args.caption;
                }
                if (this.args.content !== undefined) {
                    cell.content = this.args.content;
                }
                if (this.args.light !== undefined) {
                    cell.light = this.args.light;
                }
                if (this.args.rightBar !== undefined) {
                    cell.rightBar = this.args.rightBar;
                }
                if (this.args.bottomBar !== undefined) {
                    cell.bottomBar = this.args.bottomBar;
                }
            }
        }
    }
}