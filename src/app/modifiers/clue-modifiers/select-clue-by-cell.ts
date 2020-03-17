import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle, IClue } from 'src/app/model/interfaces';
import { Clear } from '../puzzle-modifiers/clear';
import { Clue } from 'src/app/model/clue';
import { SelectClue } from './select-clue';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { GridCell } from 'src/app/model/grid-cell';

export class SelectClueByCell implements IPuzzleModifier {
    constructor(
        private cell: GridCell
        ) { }

    exec(puzzle: PuzzleM) {
        new Clear().exec(puzzle);

        if (this.cell) {

            // Find a clue that contains this cell.  
            // Try across clues first then down clues.
            // Prefer clues that have cell in first entry over clues that have
            // the cell in linked entries

            const acrossClues = this.getAcrossClues(puzzle)
            const downClues = this.getDownClues(puzzle)
            let result: IClue = null;

            // Look in across clues, first entry only
            result = this.findCellInFirstEntry(acrossClues, this.cell.id);

            // Look in down clues, first entry only
            if (!result) {
                result = this.findCellInFirstEntry(downClues, this.cell.id);
            }

            // Look in across clues, all entries
            if (!result) {
                result = this.findCellInAnyEntry(acrossClues, this.cell.id);
            }

            // Look in down clues, all entries
            if (!result) {
                result = this.findCellInAnyEntry(downClues, this.cell.id);
            }

            if (result) {
                new SelectClue(result.id).exec(puzzle);
            }
        }
    }

    private getAcrossClues(puzzle: IPuzzle): IClue[] {
        return puzzle.clues.filter((clue) => clue.group === "across");
    }

    private getDownClues(puzzle: IPuzzle): IClue[] {
        return puzzle.clues.filter((clue) => clue.group === "down");
    }

    private findCellInFirstEntry(clues: IClue[], cellId: string): IClue {
        let result: IClue = null;

        for (let clue of clues) {
            if (!clue.redirect) {
                if (clue.entries.length) {
                    let entry = clue.entries[0];
                    entry.cellIds.forEach(id => {
                        if (id === cellId) {
                            result = clue;
                        }
                    });
                }
                if (result) {
                    break;
                }
                }
            }
        return result;
    }

    private findCellInAnyEntry(clues: IClue[], cellId: string): IClue {
        let result: IClue = null;

        for (let clue of clues) {
            if (!clue.redirect) {
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach(id => {
                        if (id === cellId) {
                            result = clue;
                        }
                    });
                });

                if (result) {
                    break;
                }
            }
        }
        return result;
    }
}