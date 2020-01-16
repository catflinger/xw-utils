import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdateInfo implements IPuzzleModifier {
    constructor(
        private args: { 
            wordPressId?:  number, 
            source?: string,
            title?: string,
        },
    ) { }

    exec(puzzle: PuzzleM) {
        if (this.args.wordPressId !== undefined) {
            puzzle.info.wordpressId = this.args.wordPressId;
        }
        if (this.args.source !== undefined) {
            puzzle.provision.source = this.args.source;
        }
        if (this.args.title !== undefined) {
            puzzle.info.title = this.args.title;
        }
    }
}