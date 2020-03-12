import { v4 as uuid } from "uuid";
import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { ClueGroup, QuillDelta } from 'src/app/model/interfaces';
import { GridCell } from 'src/app/model/grid-cell';
import { ClueM } from '../mutable-model/clue-m';
import { RenumberGid } from '../grid-modifiers/renumber-grid';

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
        let cells: ReadonlyArray<GridCell> = null;
        let maxCaption = grid.getMaxCaption();
        
        for (let n = 1; n <= maxCaption; n++) {
            cells = grid.getGridEntryForCaption(clueNumber.toString(), group);
            if (cells && cells.length) {
                let clue = this.makeClue(group, clueNumber, cells);
                puzzle.clues.push(clue);
                }
            clueNumber++;
        };
    }

    private makeClue(clueGroup: ClueGroup, clueNumber: number, cells: ReadonlyArray<GridCell>): ClueM {
        let entry: string[] = [];
        let text = "Clue text...";

        cells.forEach(cell => entry.push(cell.id));

        return {
            id: uuid(),
            group: clueGroup,
            caption: clueNumber.toString(),
            text,
            letterCount: `(${entry.length})`,
            answers: [""],
            solution: "",
            annotation: null,
            redirect: false,
            format: ",".repeat(entry.length),
            comment: new QuillDelta(),
            highlight: false,
            entries: [{
                gridRef: {
                    caption: clueNumber.toString(),
                    direction: clueGroup,
                },
                 cellIds: entry
            }],
            warnings: [],
            // gridRefs: [{
            //     clueNumber, 
            //     clueGroup
            // }],
            chunks: [
                {
                    text,
                    isDefinition: false,
                }
            ],
        };
    }

}