import { IPuzzleModifier } from '../puzzle-modifier';
import { CaptionStyle, IPuzzle } from '../../model/interfaces';

export class UpdateProvision implements IPuzzleModifier {
    constructor(
        private args: { 
            captionStyle?: CaptionStyle,
            hasLetterCount?: boolean,
            hasClueGroups?: boolean,
        },
    ) { }

    exec(puzzle: IPuzzle) {
        if (this.args.captionStyle !== undefined) {
            puzzle.provision.captionStyle = this.args.captionStyle;
        }
        if (this.args.hasLetterCount !== undefined) {
            puzzle.provision.hasLetterCount = this.args.hasLetterCount;
        }
        if (this.args.hasClueGroups !== undefined) {
            puzzle.provision.hasCluesGroups = this.args.hasClueGroups;
        }
    }
}