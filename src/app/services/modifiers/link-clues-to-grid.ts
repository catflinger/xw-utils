import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { GridEntryM } from './mutable-model/grid-entry-m';
import { Direction, ClueGroup } from 'src/app/model/interfaces';
import { RenumberGid } from './renumber-grid';

interface GridReference {
    // for example: 2 down or 23 across
    clueNumber: number,
    clueGroup: ClueGroup 
}
export class LinkCluesToGrid implements IPuzzleModifier {
    constructor() { }

    public exec(puzzle: PuzzleM): boolean {
        try {
            if (puzzle.grid && puzzle.clues && puzzle.clues.length > 0) {
                let captionWriter = new RenumberGid();
                captionWriter.exec(puzzle);
                
                puzzle.clues.forEach((clue) => {
                    const grid = new Grid(puzzle.grid);
        
                    // parse the clue caption into grid references
                    if (!clue.redirect) {
                        clue.entries = LinkCluesToGrid.makeGridEntries(grid, clue.caption, clue.group);
                    }
                });

                // TO DO: check entries match the letter count

                puzzle.info.blogable = true;
                puzzle.info.solveable = true;
                puzzle.linked = true;
            }
        } catch (error) {
            //console.log("Link error: " + error)
            return true;
        }
        return false;
    }

    private static makeGridEntries(grid: Grid, caption: string, direction: Direction): GridEntryM[] {
        let result: GridEntryM[] = [];
        let gridRefs = LinkCluesToGrid.readGridReferences(caption, direction);

        gridRefs.forEach((gridRef) => {
            let gridEntry: GridEntryM = { cellIds: [] };
            let cells = grid.getGridEntryForCaption(gridRef.clueNumber.toString(), gridRef.clueGroup);

            cells.forEach(cell => gridEntry.cellIds.push(cell.id));
            result.push(gridEntry);
        });


        return result;
    }

    private static readGridReferences(caption: string, direction: ClueGroup): GridReference[] {
        let result: GridReference[] = [];
        const expression = new RegExp(String.raw`\s*(?<clueNumber>\d{1,2})(\s?(?<direction>(across)|(down)))?`);

        let parts = caption.split(",");

        //console.log("CAPTION = " + caption);
        //console.log("PARTS = " + JSON.stringify(parts));

        parts.forEach((part) => {
            let clueNumber: number = 0;
            let clueGroup: ClueGroup = direction;

            let match = expression.exec(part);

            if (match.groups.clueNumber) {
                clueNumber = parseInt(match.groups.clueNumber);
                if (match.groups.direction) {
                    clueGroup = <ClueGroup>match.groups.direction.toLowerCase(); 
                }
                result.push({ clueNumber, clueGroup });
            }
        });

        return result;
    }

}