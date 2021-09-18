import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, ClueGroup, IClue } from '../../model/interfaces';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { ClueBuffer } from 'src/app/services/parsing/text/clue-buffer';
import { stringify } from 'querystring';

export class AddClue implements IPuzzleModifier {
    constructor(
        private caption: string,
        private group: ClueGroup,
        private text: string,
        private clueId?: string,
    ) { 
        console.log(`ADD CLUE PARAMS: caption[${caption}]`)
        console.log(`ADD CLUE PARAMS: group[${group}]`)
        console.log(`ADD CLUE PARAMS: text[${text}]`)
        console.log(`ADD CLUE PARAMS: id[${clueId}]`)
    }

    exec(puzzle: IPuzzle) {
        console.log(`PUZZLE provision: ${JSON.stringify(puzzle.provision, null, 2)}`)
        if (puzzle) {
            let fullText = this.caption + " " + this.text;
            let clue: IClue = null;

            if (puzzle.provision.captionStyle === "numbered" || puzzle.provision.captionStyle === "alphabetical") {
                const cb: ClueBuffer = new ClueBuffer(puzzle.provision.captionStyle, fullText, this.group);

                clue = Clue.makeClue(
                    cb.caption,
                    cb.clue,
                    cb.letterCount,
                    this.group,
                    this.clueId
                ).toMutable();

            } else {
                clue = Clue.makeClue(
                    this.caption, 
                    this.text,
                    Clue.getLetterCount(this.text),
                    this.group,
                    this.clueId,
                ).toMutable();

            }
            clue.warnings = Clue.validateAnnotation(clue.answers[0], clue.comment, clue.chunks);

            puzzle.clues.push(clue);

            puzzle.clues = [...puzzle.clues];
        }
    }
}