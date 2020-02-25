import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { Clear } from '../puzzle-modifiers/clear';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class SelectClue implements IPuzzleModifier {
    constructor(public readonly clueId: string) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            let red = new Clear();
            red.exec(puzzle);

            let clue = puzzle.clues.find((clue) => clue.id === this.clueId);
            if (clue && !clue.redirect) {
                clue.highlight = true;
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach((cellId) => {
                        let cell = puzzle.grid.cells.find((cell) => cell.id === cellId);
                        cell.highlight = true;
                    });
                });
            }
        }
    }
}