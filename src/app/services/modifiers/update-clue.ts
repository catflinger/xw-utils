import { IPuzzleModifier } from './puzzle-modifier';
import { QuillDelta, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdateClue implements IPuzzleModifier {
    constructor(
        private id: string,
        private caption: string,
        private text: string,
    ) { }

    exec(puzzle: PuzzleM) {
        let clue = puzzle.clues.find((c) => c.id === this.id);

        if (clue) {
            clue.caption = this.caption;
            clue.text = this.text;

            // TO DO: refresh/reset the dependent fields
        }
    }
}