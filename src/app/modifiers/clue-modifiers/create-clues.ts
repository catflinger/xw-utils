import { v4 as uuid } from "uuid";
import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { ClueGroup } from 'src/app/model/interfaces';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { IClue } from '../../model/interfaces';
import { RenumberGid } from '../grid-modifiers/renumber-grid';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';

export class CreateClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.grid) {
            new RenumberGid().exec(puzzle);
            puzzle.clues = [];

            let grid = new Grid(puzzle.grid);

            this.makeClues(puzzle, grid, "across");
            this.makeClues(puzzle, grid, "down");

        }
    }

    private makeClues(puzzle: IPuzzle, grid: Grid, group: ClueGroup) {
        let clueNumber = 1;
        const maxCaption = grid.getMaxCaption();
        
        for (let n = 1; n <= maxCaption; n++) {
            let gridRef: GridReference = new GridReference({
                caption: clueNumber,
                direction: group,
            });
            
            let cells: ReadonlyArray<GridCell> = grid.getGridEntryFromReference(gridRef);
 
            if (cells.length) {
                let clue = this.makeClue(group, clueNumber, gridRef, cells.length);
                puzzle.clues.push(clue);
            }
            clueNumber++;
        };
    }

    private makeClue(clueGroup: ClueGroup, clueNumber: number, gridRef: GridReference, entryLength: number): IClue {
        const clueText = `Clue text (${entryLength})`;
        return {
            id: uuid(),
            group: clueGroup,
            caption: clueNumber.toString(),
            text: clueText,
            letterCount: `(${entryLength})`,
            answers: [""],
            solution: "",
            annotation: null,
            redirect: null,
            format: ",".repeat(entryLength),
            comment: { ops: []},
            highlight: false,
            link: {
                warning: null,
                gridRefs: [gridRef],
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