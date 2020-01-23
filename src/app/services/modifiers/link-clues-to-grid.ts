import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { GridEntryM } from './mutable-model/grid-entry-m';
import { Direction, ClueGroup } from 'src/app/model/interfaces';
import { RenumberGid } from './renumber-grid';
import { Clue } from 'src/app/model/clue';
import { ClueM } from './mutable-model/clue-m';


export class LinkCluesToGrid implements IPuzzleModifier {
    constructor() { }

    public exec(puzzle: PuzzleM) {
        if (puzzle.grid && puzzle.clues && puzzle.clues.length > 0) {

            let captionWriter = new RenumberGid();
            captionWriter.exec(puzzle);

            const grid = new Grid(puzzle.grid);

            puzzle.clues.forEach((clue) => {
                // parse the clue caption into grid references
                if (!clue.redirect) {
                    clue.entries = this.makeGridEntries(grid, clue);
                }
            });

            // TO DO: check entries match the letter count

            puzzle.capability.blogable = true;
            puzzle.capability.solveable = true;
            puzzle.linked = true;
        }
    }

    private makeGridEntries(grid: Grid, clue: ClueM): GridEntryM[] {
        let result: GridEntryM[] = [];

        if (clue.gridRefs) {
            clue.gridRefs.forEach((gridRef, index) => {
                let gridEntry: GridEntryM = { cellIds: [] };
                let cells = grid.getGridEntryForCaption(gridRef.clueNumber.toString(), gridRef.clueGroup);

                // check that this is the right entry
                if (index === 0) {
                    if (cells.length === 0) {
                        throw new Error(`Could not find any entry in grid for ${gridRef.clueNumber} ${gridRef.clueGroup}`);
                    }
                } else {
                    if (cells.length === 0 || cells[0].caption !== gridRef.clueNumber.toString()) {
                        
                        // this might represent the case where the second or subsequent reference is not in the same group
                        // as the first reference. Try again but look in the other group
                        cells = grid.getGridEntryForCaption(
                            gridRef.clueNumber.toString(), 
                            gridRef.clueGroup === "across" ? "down" : "across");
                        
                            // check that the second go finds an entry
                        if (cells.length === 0) {
                            throw new Error(`Could not find any entry in grid for ${gridRef.clueNumber} ${gridRef.clueGroup}`);
                        }
                    }
                }
                cells.forEach(cell => gridEntry.cellIds.push(cell.id));
                result.push(gridEntry);
            });
        }
        return result;
    }
}