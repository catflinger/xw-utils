import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { ClueM } from '../mutable-model/clue-m';

export class LinkCluesToGrid implements IPuzzleModifier {
    constructor(private clueId?: string) { }

    public exec(puzzle: PuzzleM) {
        if (puzzle.grid && puzzle.clues && puzzle.clues.length > 0) {

            // let captionWriter = new RenumberGid();
            // captionWriter.exec(puzzle);

            const grid = new Grid(puzzle.grid);
            let clues: ClueM[];

            if (this.clueId) {
                // process just the specified clue
                let clue: ClueM = puzzle.clues.find(c => c.id === this.clueId);
                if (clue) {
                    clues = [clue];
                }
            } else {
                // if no id given then default processing all clues
                clues = puzzle.clues;
            }

            clues.forEach((clue) => {
                if (!clue.redirect) {
                    this.setGridEntries(grid, clue);
                }
            });

            puzzle.capability.blogable = true;
            puzzle.capability.solveable = true;
            puzzle.linked = true;
            puzzle.capability.ready = true;
        }
    }

    private setGridEntries(grid: Grid, clue: ClueM) {

        clue.entries.forEach((entry, index) => {
            let gridRef = entry.gridRef;

            if (!gridRef) {
                throw new Error(`Clue for ${clue.caption} ${clue.group}has no grid reference`);
            } else {
                entry.cellIds = [];
                grid.getGridEntryFromReference(entry.gridRef).forEach(cell => {
                    entry.cellIds.push(cell.id)
                });
            }
        });
    }

}