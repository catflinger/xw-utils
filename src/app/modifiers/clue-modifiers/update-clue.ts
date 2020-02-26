import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { ClueGroup } from 'src/app/model/interfaces';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { Clue } from 'src/app/model/clue';

export class UpdateClue implements IPuzzleModifier {
    constructor(
        private id: string,
        private caption: string,
        private group: ClueGroup,
        private text: string,
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            let clue = puzzle.clues.find((c) => c.id === this.id);

            if (clue) {
                clue.caption = this.caption;
                clue.group = this.group,
                clue.text = this.text;
                clue.letterCount = Clue.getLetterCount(this.text);
                clue.format = Clue.getAnswerFormat(clue.letterCount);
                clue.chunks = [{
                    text: this.text,
                    isDefinition: false,
                }];

                // TO DO: is this necessary?  Can the validation outcome change as a result of this modification?
                clue.warnings = Clue.validateAnnotation(clue.answers[0], clue.comment, clue.chunks);
            }
        }
    }
}