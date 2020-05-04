import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
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
            ready?: boolean,
        },
    ) { }

    exec(puzzle: IPuzzle) {
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
            puzzle.capability.solveable = this.args.solveable;
        }
        if (this.args.blogable !== undefined) {
            puzzle.capability.blogable = this.args.blogable;
        }
        if (this.args.gridable !== undefined) {
            puzzle.capability.gridable = this.args.gridable;
        }
        if (this.args.ready !== undefined) {
            puzzle.capability.ready = this.args.ready;
        }
    }
}