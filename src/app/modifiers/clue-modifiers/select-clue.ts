import { IPuzzleModifier } from '../puzzle-modifier';
import { Clear } from '../puzzle-modifiers/clear';
import { IPuzzle } from '../../model/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class SelectClue implements IPuzzleModifier {
    constructor(
        public readonly clueId: string,
        private followRedirects: boolean = false,
    ) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            new Clear().exec(puzzle);

            // TO DO: temp fix, do something better
            let gridX: Grid = puzzle.grid ? new Grid(puzzle.grid) : null;

            let clue = puzzle.clues.find((clue) => clue.id === this.clueId);

            if (clue) {
                clue.highlight = true;

                if (gridX) {
                    clue.link.entries.forEach((entry) => {
                        let cells = gridX.getGridEntryFromReference(entry.gridRef);
                        if (cells) {
                            cells.forEach(cell => {
                                // find the matching cell in the mutable puzzle
                                let cellm = puzzle.grid.cells.find(c => c.id === cell.id);
                                cellm.highlight = true;
                            });
                        }
                    });
                }
            } else if (clue.redirect) {
                // TO DO: ... folow redirect...

            }
        }
    }
}