import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, ClueGroup } from '../../model/interfaces';
import { Clue } from 'src/app/model/puzzle-model/clue';

interface UpdateClueArgs {
    id: string;
    caption?: string;
    group?: ClueGroup;
    text?: string;
}

export class UpdateClue implements IPuzzleModifier {
    constructor(private args: UpdateClueArgs) { }

    exec(puzzle: IPuzzle) {
        if (puzzle && this.args) {
            let clue = puzzle.clues.find((c) => c.id === this.args.id);

            if (clue) {
                if (this.args.caption !== undefined) {
                    clue.caption = this.args.caption;
                }
                if (this.args.group !== undefined) {
                    clue.group = this.args.group;
                }
                if (this.args.text !== undefined) {
                    clue.text = this.args.text;
                }

                clue.letterCount = Clue.getLetterCount(clue.text);
                clue.format = Clue.getAnswerFormat(clue.letterCount);
                clue.chunks = [{
                    text: clue.text,
                    isDefinition: false,
                }];

                // TO DO: is this necessary?  Can the validation outcome change as a result of this modification?
                clue.warnings = Clue.validateAnnotation(clue.answers[0], clue.comment, clue.chunks);
            }
        }
    }
}