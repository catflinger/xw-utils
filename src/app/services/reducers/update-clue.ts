import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/puzzle';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { Validate } from './validate';

export class UpdateClue implements IReducer {
    constructor(
        private id: string,
        private answer: string,
        private comment: string,
        private chunks: TextChunk[]) { }

    exec(puzzle: IPuzzle) {
        let clue = puzzle.clues.find((c) => c.id === this.id);

        if (clue) {

            // commit the change
            clue.answer = this.answer.trim().toUpperCase();
            clue.comment = this.comment.trim();
            clue.chunks = this.chunks;

            this.updateGridText(puzzle);

            new Validate().exec(puzzle);
        }
    }

    private updateGridText(puzzle: IPuzzle) {
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