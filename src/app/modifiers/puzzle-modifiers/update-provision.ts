import { IPuzzleModifier } from '../puzzle-modifier';
import { CaptionStyle, IPuzzle } from '../../model/interfaces';

export class UpdateProvision implements IPuzzleModifier {
    constructor(
        private args: { 
            captionStyle?: CaptionStyle,
            hasLetterCount?: boolean,
            hasClueGroupHeadings?: boolean,
        },
    ) { }

    exec(puzzle: IPuzzle) {
        if (this.args.captionStyle !== undefined) {
            puzzle.provision.captionStyle = this.args.captionStyle;
        }
        if (this.args.hasLetterCount !== undefined) {
            puzzle.provision.hasLetterCount = this.args.hasLetterCount;
        }
        if (this.args.hasClueGroupHeadings !== undefined) {
            puzzle.provision.hasClueGroupHeadings = this.args.hasClueGroupHeadings;
        }
    }
}