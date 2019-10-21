import { IPuzzleModifier } from './puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';
import { ClearSelection } from './clear-selection';
import { PuzzleM } from './mutable-model/puzzle-m';

export class SelectClue implements IPuzzleModifier {
    constructor(public readonly clueId: string) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            let red = new ClearSelection();
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