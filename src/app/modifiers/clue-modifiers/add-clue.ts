import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, ClueGroup } from '../../model/interfaces';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { ClueBuffer } from 'src/app/services/parsing/text/clue-buffer';

export class AddClue implements IPuzzleModifier {
    constructor(
        private caption: string,
        private group: ClueGroup,
        private text: string,
        private clueId?: string,
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            let fullText = this.caption + " " + this.text;
            const cb: ClueBuffer = new ClueBuffer(puzzle.provision.captionStyle, fullText, this.group);

            const clue = Clue.makeClue(
                cb.caption,
                cb.clue,
                cb.letterCount,
                this.group,
                this.clueId
            ).toMutable();
            clue.warnings = Clue.validateAnnotation(clue.answers[0], clue.comment, clue.chunks);

            puzzle.clues.push(clue);

            puzzle.clues = [...puzzle.clues];
        }
    }
}