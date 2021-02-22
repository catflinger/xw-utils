import { IPuzzleModifier } from '../puzzle-modifier';
import { ClueStyle, IPuzzle } from '../../model/interfaces';
import { PuzzleProvider } from 'src/app/model/interfaces';

export class UpdateProvision implements IPuzzleModifier {
    constructor(
        private args: { 
            clueStyle?: ClueStyle,
        },
    ) { }

    exec(puzzle: IPuzzle) {
        if (this.args.clueStyle !== undefined) {
            puzzle.provision.clueStyle = this.args.clueStyle;
        }
    }
}