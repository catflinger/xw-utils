import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { ClueValidationWarning } from 'src/app/model3/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { IPuzzle } from '../../model3/interfaces';
import { SyncGridContent } from '../grid-modifiers/sync-grid-content';
import { Clue } from 'src/app/model/clue';
import { QuillDelta } from 'src/app/model/quill-delta';

export class AnnotateClue implements IPuzzleModifier {
    constructor(
        private id: string,
        private answers: ReadonlyArray<string>,
        private comment: QuillDelta,
        private chunks: TextChunk[],
        private warnings: ClueValidationWarning[]) { }

    exec(puzzle: IPuzzle) {
        //console.log("MODIFIER annotate clue:  " + JSON.stringify({id: this.id, answers: this.answers, comment: this.comment}))

        let clue = puzzle.clues.find((c) => c.id === this.id);

        if (clue) {
            let answers: string[] = [];

            // update/add any existing answers
            this.answers.forEach((answer, index) => {
                let ans = index === 0 ? answer.trim().toUpperCase() : answer.trim();
                answers.push(ans);
            });
            // keep any existing answers (in the case number of columns has decreased since last edit)
            for (let i = answers.length; i < clue.answers.length; i++) {
                answers.push(clue.answers[i]);
            }

            clue.answers = answers;
            clue.comment = this.comment;
            clue.chunks = this.chunks;
            clue.warnings = this.warnings || [];

            new SyncGridContent().exec(puzzle);

            clue.warnings = Clue.validateAnnotation(clue.answers[0], clue.comment, clue.chunks);
        }
    }
}