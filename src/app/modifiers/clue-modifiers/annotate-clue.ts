import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { QuillDelta, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { SyncGridContent } from '../grid-modifiers/sync-grid-content';

export class AnnotateClue implements IPuzzleModifier {
    constructor(
        private id: string,
        private answers: ReadonlyArray<string>,
        private comment: QuillDelta,
        private chunks: TextChunk[],
        private warnings: ClueValidationWarning[]) { }

    exec(puzzle: PuzzleM) {
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
        }
    }
}