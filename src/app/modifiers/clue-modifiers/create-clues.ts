import { v4 as uuid } from "uuid";
import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { Grid } from 'src/app/model/grid';
import { ClueGroup, QuillDelta } from 'src/app/model/interfaces';
import { GridCell } from 'src/app/model/grid-cell';
import { ClueM } from '../mutable-model/clue-m';
import { RenumberGid } from '../grid-modifiers/renumber-grid';
import { GridReference } from 'src/app/model/grid-reference';

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

            //puzzle.linked = true;
        }
    }

    private makeClues(puzzle: PuzzleM, grid: Grid, group: ClueGroup) {
        let clueNumber = 1;
        const maxCaption = grid.getMaxCaption();
        
        for (let n = 1; n <= maxCaption; n++) {
            let gridRef: GridReference = new GridReference({
                caption: clueNumber,
                direction: group,
            });
            
            let cells: ReadonlyArray<GridCell> = grid.getGridEntryFromReference(gridRef);
            
            if (cells && cells.length) {
                let clue = this.makeClue(group, clueNumber, gridRef, cells.length);
                puzzle.clues.push(clue);
            }
            clueNumber++;
        };
    }

    private makeClue(clueGroup: ClueGroup, clueNumber: number, gridRef: GridReference, entryLength: number): ClueM {
        let clueText = "Clue text...";

        return {
            id: uuid(),
            group: clueGroup,
            caption: clueNumber.toString(),
            text: clueText,
            letterCount: `(${entryLength})`,
            answers: [""],
            solution: "",
            annotation: null,
            redirect: false,
            format: ",".repeat(entryLength),
            comment: new QuillDelta(),
            highlight: false,
            link: {
                warning: null,
                entries: [{
                    gridRef,
                    //cellIds: entry
                }],
            },
            warnings: [],
            // gridRefs: [{
            //     clueNumber, 
            //     clueGroup
            // }],
            chunks: [
                {
                    text: clueText,
                    isDefinition: false,
                }
            ],
        };
    }

}