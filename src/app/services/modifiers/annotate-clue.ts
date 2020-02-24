import { IPuzzleModifier } from './puzzle-modifier';
import { QuillDelta, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PuzzleM } from './mutable-model/puzzle-m';
import { SyncGridContent } from './sync-grid-content';

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

            clue.answers.forEach((answer, index) => {
                clue.answers = [];
                let ans = index === 0 ? answer.trim().toUpperCase() : answer.trim();
                clue.answers.push(ans);
            });
            
            clue.comment = this.comment;
            clue.chunks = this.chunks;
            clue.warnings = this.warnings || [];

            new SyncGridContent().exec(puzzle);
        }
    }
}