import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, IClue } from 'src/app/model/interfaces';
import { Clear } from '../puzzle-modifiers/clear';
import { SelectClue } from './select-clue';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class SelectClueByCell implements IPuzzleModifier {
    constructor(
        private cellId: string,
        private followRedirects: boolean = false,
    ) { }

    exec(puzzle: IPuzzle) {
        new Clear().exec(puzzle);

        if (this.cellId && puzzle.grid) {
            let grid = new Grid(puzzle.grid);

            // Find a clue that contains this cell.  
            // Try across clues first then down clues.
            // Prefer clues that have cell in first entry over clues that have
            // the cell in linked entries

            const acrossClues = this.getAcrossClues(puzzle)
            const downClues = this.getDownClues(puzzle)
            let result: IClue = null;

            // Look in across clues, first entry only
            result = this.findCellInFirstEntry(acrossClues, this.cellId, grid);

            // Look in down clues, first entry only
            if (!result) {
                result = this.findCellInFirstEntry(downClues, this.cellId, grid);
            }

            // Look in across clues, all entries
            if (!result) {
                result = this.findCellInAnyEntry(acrossClues, this.cellId, grid);
            }

            // Look in down clues, all entries
            if (!result) {
                result = this.findCellInAnyEntry(downClues, this.cellId, grid);
            }

            if (result) {
                new SelectClue(result.id, this.followRedirects).exec(puzzle);
            }
        }
    }

    private getAcrossClues(puzzle: IPuzzle): IClue[] {
        return puzzle.clues.filter((clue) => clue.group === "across");
    }

    private getDownClues(puzzle: IPuzzle): IClue[] {
        return puzzle.clues.filter((clue) => clue.group === "down");
    }

    private findCellInFirstEntry(clues: IClue[], cellId: string, grid: Grid): IClue {
        let result: IClue = null;

        for (let clue of clues) {
            
            if (!clue.redirect) {
                
                if (clue.link.gridRefs.length) {
                    let gridRef = clue.link.gridRefs[0];
                    let cells = grid.getGridEntryFromReference(gridRef);

                    if (cells.length) {
                        cells.map(c => c.id)
                        .forEach(id => {
                            if (id === cellId) {
                                result = clue;
                            }
                        });
                    }
                }
                
                if (result) {
                    break;
                }
                
            }
        }
        
        return result;
    }

    private findCellInAnyEntry(clues: IClue[], cellId: string, grid: Grid): IClue {
        let result: IClue = null;

        for (let clue of clues) {
            if (!clue.redirect) {
                clue.link.gridRefs.forEach((gridRef) => {
                    let cells = grid.getGridEntryFromReference(gridRef);
                    if (cells.length) {
                        cells.forEach(cell => {
                            if (cell.id === cellId) {
                                result = clue;
                            }
                        });
                    }
                });

                if (result) {
                    break;
                }
            }
        }
        return result;
    }
}