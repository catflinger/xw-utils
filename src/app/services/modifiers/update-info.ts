import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdateInfo implements IPuzzleModifier {
    constructor(
        public args: {title: string}
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (this.args) {
                if (this.args.title) {
                    puzzle.info.title = this.args.title;
                }
            }
        }
    }
}