import { IPuzzleModifier } from './puzzle-modifier';
import { QuillDelta, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PuzzleM } from './mutable-model/puzzle-m';

export class SyncGridContent implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (!puzzle || !puzzle.clues || !puzzle.grid) {
            return;
        }

        // clear the grid
        puzzle.grid.cells.forEach(cell => cell.content = "");

        puzzle.clues.forEach((clue) => {
            let answer = clue.answers[0].toUpperCase().replace(/[^A-Z]/g, "");
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