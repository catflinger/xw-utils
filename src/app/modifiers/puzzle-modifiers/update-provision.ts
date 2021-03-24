import { IPuzzleModifier } from '../puzzle-modifier';
import { CaptionStyle, IPuzzle } from '../../model/interfaces';
import { PuzzleProvider } from 'src/app/model/interfaces';

export class UpdateProvision implements IPuzzleModifier {
    constructor(
        private args: { 
            clueStyle?: CaptionStyle,
            hasLetterCount?: boolean,
        },
    ) { }

    exec(puzzle: IPuzzle) {
        if (this.args.clueStyle !== undefined) {
            puzzle.provision.captionStyle = this.args.clueStyle;
        }
        if (this.args.hasLetterCount !== undefined) {
            puzzle.provision.hasLetterCount = this.args.hasLetterCount;
        }
    }
}