import { Injectable } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { ClueBuffer } from '../parsing/text/clue-buffer';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';


export interface ILinkWarning {
    clueId: string,
    readonly message: string;
}

@Injectable({
    providedIn: 'root'
})
export class LinkValidationService {

    constructor() { }

    public validatePuzzle(puzzle: Puzzle): ReadonlyArray<ILinkWarning> {
        let warnings: ILinkWarning[] = [];

        /* TESTS TO RUN
        For each clue check that:

        1) the clue has at least one grid entry
        2) all the cells in the entry are writeable
        3) the clue has a letter count
        4) the letter count matches the combined length of the entries (tricky!)
        5) the clue number(s) match the numbers in the grid

        For each light in the grid check that:

        1) there is at least one clue linking to this light

        */
        puzzle.clues.forEach((clue) => {

            let cb: ClueBuffer = new ClueBuffer(puzzle.provision.captionStyle, clue.text, clue.group, null);

            if (clue.redirect) {
                // TO DO: should a redirect have an entry?
            } else if (puzzle.grid) {
                if (clue.link.gridRefs.length === 0) {
                    // TO DO: rasie a warning here
                } else {
                    warnings.concat(
                        this.matchClueNumbersToGridEntries(clue, cb, puzzle.grid)
                    );
                }
            }
        });

        return warnings;
    }

    private matchClueNumbersToGridEntries(clue: Clue, buffer: ClueBuffer, grid: Grid): ILinkWarning[] {
        let warnings: ILinkWarning[] = [];
        let gridRefs: ReadonlyArray<GridReference> = []; 

        // HOW ABOUT REMOVING GRID REFS from CLUE?

        /* 
        For each GridRef {
            check the number in th grid ref matches the caption in the first cell of each grid enty
            check other stuff too
            remember: both the grid and the clue may have changed
        }
        */

        // if (buffer.gridRefs.length === 0) {
        //     warnings.push({
        //         clueId: clue.id,
        //         message: "this clue is missing gridReferences" // TO DO: this message needs to make more sense
        //     });
        // } else if (buffer.gridRefs.length !== gridRefs.entries.length) {
        //     warnings.push({
        //         clueId: clue.id,
        //         message: `the clue text indicates ${buffer.gridRefs.length} gird entries but the clue has ${gridRefs.entries.length} entries`
        //     });
        // } else {
        //     for (let i = 0; i < buffer.gridRefs.length; i++) {
        //         //find the caption in teh grid
        //         let cell = grid.cells.find(c => c.id === gridRefs.entries[i]);
        //         if (cell.caption !== buffer.gridRefs[i].clueNumber.toString()) {
        //             warnings.push({
        //                 clueId: clue.id,
        //                 message: "there is a mismatch between the captions in the clue text and the captions in the grid. " +
        //                 `This is for entry number ${i} clue caption ${buffer.gridRefs[i].clueNumber.toString()} and ther grid cell at (${cell.x}, ${cell.y})`
        //             });
        //         }
        //     }
        // }

        return warnings;
    }
}
