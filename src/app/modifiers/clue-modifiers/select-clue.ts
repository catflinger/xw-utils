import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { Clear } from '../puzzle-modifiers/clear';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';

export class SelectClue implements IPuzzleModifier {
    constructor(public readonly clueId: string) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            new Clear().exec(puzzle);

            let grid: Grid = puzzle.grid ? new Grid(puzzle.grid) : null;

            let clue = puzzle.clues.find((clue) => clue.id === this.clueId);

            if (clue && !clue.redirect) {
                clue.highlight = true;

                if (grid) {
                    clue.link.entries.forEach((entry) => {
                        let cells = grid.getGridEntryFromReference(entry.gridRef);
                        if (cells) {
                            cells.forEach(cell => {
                                // find the matching cell in the mutable puzzle
                                let cellm = puzzle.grid.cells.find(c => c.id === cell.id);
                                cellm.highlight = true;
                            });
                        }
                    });
                }
            }
        }
    }
}