import { v4 as uuid } from "uuid";
import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { ClueGroup, QuillDelta } from 'src/app/model/interfaces';
import { GridCell } from 'src/app/model/grid-cell';
import { ClueM } from './mutable-model/clue-m';
import { RenumberGid } from './renumber-grid';

export class CreateClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.grid) {
            new RenumberGid().exec(puzzle);
            puzzle.clues = [];

            let grid = new Grid(puzzle.grid);

            this.makeClues(puzzle, grid, "across");
            this.makeClues(puzzle, grid, "down");

            puzzle.capability.solveable = true;
            puzzle.capability.blogable = true;
            puzzle.capability.ready = true;
            puzzle.capability.gridable = true;

            puzzle.linked = true;
        }
    }

    private makeClues(puzzle: PuzzleM, grid: Grid, group: ClueGroup) {
        let clueNumber = 1;
        let cells: GridCell[] = null;
        
        while ((cells = grid.getGridEntryForCaption(clueNumber.toString(), group)).length > 0) {
            let clue = this.makeClue(group, clueNumber, cells);
            //console.log("ADDING CLUE " + JSON.stringify(clue));
            puzzle.clues.push(clue);
            clueNumber++;
        };
    }

    private makeClue(clueGroup: ClueGroup, clueNumber: number, cells: GridCell[]): ClueM {
        let entry: string[] = [];
        let text = "Clue text...";

        cells.forEach(cell => entry.push(cell.id));

        return {
            id: uuid(),
            group: clueGroup,
            caption: clueNumber.toString(),
            text,
            letterCount: `(${entry.length})`,
            answer: "",
            solution: "",
            annotation: null,
            redirect: false,
            format: ",".repeat(entry.length),
            comment: new QuillDelta(),
            highlight: false,
            entries: [{
                 cellIds: entry
            }],
            warnings: [],
            gridRefs: [{
                clueNumber, 
                clueGroup
            }],
            chunks: [
                {
                    text,
                    isDefinition: false,
                }
            ],
        };
    }

}