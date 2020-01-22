import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { PuzzleProvider } from 'src/app/model/interfaces';

export class UpdateInfo implements IPuzzleModifier {
    constructor(
        private args: { 
            wordPressId?:  number, 
            source?: string,
            title?: string,
            provider?: PuzzleProvider,
            blogable?: boolean,
            solveable?: boolean,
            gridable?: boolean,
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
        if (this.args.provider !== undefined) {
            puzzle.info.provider = this.args.provider;
        }
        if (this.args.solveable !== undefined) {
            puzzle.info.solveable = this.args.solveable;
        }
        if (this.args.blogable !== undefined) {
            puzzle.info.blogable = this.args.blogable;
        }
        if (this.args.gridable !== undefined) {
            puzzle.info.gridable = this.args.gridable;
        }
    }
}