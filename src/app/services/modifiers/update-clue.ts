import { IPuzzleModifier } from './puzzle-modifier';
import { QuillDelta, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdateClue implements IPuzzleModifier {
    constructor(
        private id: string,
        private answer: string,
        private comment: QuillDelta,
        private chunks: TextChunk[],
        private warnings: ClueValidationWarning[]) { }

    exec(puzzle: PuzzleM) {
        let clue = puzzle.clues.find((c) => c.id === this.id);

        if (clue) {

            // commit the change
            clue.answer = this.answer.trim().toUpperCase();
            clue.comment = this.comment;
            clue.chunks = this.chunks;
            clue.warnings = this.warnings || [];

            this.updateGridText(puzzle);
        }
    }

    private updateGridText(puzzle: PuzzleM) {
        if (!puzzle.grid) {
            return;
        }
        // clear the grid
        puzzle.grid.cells.forEach(cell => cell.content = "");

        puzzle.clues.forEach((clue) => {
            let answer = clue.answer.toUpperCase().replace(/[^A-Z]/g, "");
            let index = 0;

            if (answer) {
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach((id) => {
                        let cell = puzzle.grid.cells.find(c => c.id === id);
                        if (index < answer.length) {
                            cell.content = answer.charAt(index);
                        }
                        index++;
                    });
                });
            }
        });
    }
}