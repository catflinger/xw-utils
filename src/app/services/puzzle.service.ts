import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle, Clue, GridCell } from '../model/puzzle';

import { data } from "./data1";
import { ClueUpdate } from './clue-update';

// This is a basic implimentation of an immutable store:
//      the model (Puzzle) is not to be changed by the application
//      changes are made only through public functions on this service
//      an new updated model is produced an added to the Behaviour Subject
//      application components listen for new models by subscribing to the BS

// This might be better done using a storage framework such as Redux, but I don't have the time to learn a framework right now.
// Once I get on top of the rest of the app then I might try and go back and retro fit Redux or similar later


@Injectable({
    providedIn: 'root'
})
export class PuzzleService {

    private bs: BehaviorSubject<Puzzle>;

    constructor() {
        this.bs = new BehaviorSubject<Puzzle>(null);
    }

    public getObservable(): Observable<Puzzle> {
        return this.bs.asObservable();
    }

    public loadPuzzle(puzzleId: string) {
        let puzzle: Puzzle;

        const json = localStorage.getItem("xw-puzzle");
        if (json) {
            puzzle = JSON.parse(json);
        } else {
            puzzle = data;
        }
        this.updateGridText(puzzle);
        this.bs.next(puzzle);
    }

    public clearPuzzles() {
        localStorage.clear();
    }

    public cellAt(x: number, y: number): GridCell {
        let result: GridCell = null;

        let puzzle = this.bs.value;

        if (puzzle) {
            result = this.bs.value.grid.cells.find((cell) => cell.x === x && cell.y === y);
        }
        return result;
    }

    public getSelectedClue(): Clue {
        let result: Clue = null;
        let puzzle = this.bs.value;

        if (puzzle) {
            result = puzzle.clues.find((clue) => clue.highlight);
        }

        return result;
    }

    public getLatestAnswer(clueId: string): string {
        let result: string = "";
        let puzzle = this.bs.value;

        if (puzzle) {

            let clue = this.findClue(puzzle, clueId);
            clue.entries.forEach((entry) => {
                entry.cellIds.forEach((id) => {
                    let cell = this.findCell(puzzle, id);
                    let letter = cell.content.length > 0 ? cell.content.charAt(0) : "_"
                    result += letter + " ";
                })
            });
        }

        return result.trim();
    }

    public selectClue(clueId: string) {
        let puzzle = this.getMutable();

        if (puzzle) {

            this.clearHighlights(puzzle);

            let clue = puzzle.clues.find((clue) => clue.id === clueId);
            if (clue) {
                clue.highlight = true;
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach((cellId) => {
                        let cell = puzzle.grid.cells.find((cell) => cell.id === cellId);
                        cell.highlight = true;
                    });
                });
            }
            this.commit(puzzle);
        }
    }

    public selectClueByCell(x: number, y: number): void {
        let puzzle = this.getMutable();

        if (puzzle) {

            this.clearHighlights(puzzle);

            let cell = puzzle.grid.cells.find((cell) => cell.x === x && cell.y === y);
            if (cell) {

                // Find a clue that contains this cell.  
                // Try across clues first then down clues.
                // Prefer clues that have cell in first entry over clues that have
                // the cell in linked entries

                const acrossClues = this.getAcrossClues(puzzle)
                const downClues = this.getDownClues(puzzle)
                let result: Clue = null;

                // Look in across clues, first entry only
                result = this.findCellInFirstEntry(acrossClues, cell.id);

                // Look in down clues, first entry only
                if (!result) {
                    result = this.findCellInFirstEntry(downClues, cell.id);
                }

                // Look in across clues, all entries
                if (!result) {
                    result = this.findCellInAnyEntry(acrossClues, cell.id);
                }

                // Look in down clues, all entries
                if (!result) {
                    result = this.findCellInAnyEntry(downClues, cell.id);
                }

                if (result) {
                    this.highlightClue(puzzle, result)
                }

                this.commit(puzzle);
            }
        }
    }

    public updateClue(id: string, delta: ClueUpdate) {
        let puzzle = this.getMutable();

        if (puzzle) {
            let clue = puzzle.clues.find((c) => c.id === id);

            if (clue) {
                // TO DO: do some validation on the values in the delta here

                // commit the change
                clue.answer = delta.answer.toUpperCase();
                clue.comment = delta.comment;
                clue.definition = delta.definition;

                this.updateGridText(puzzle);

                this.commit(puzzle);
            }
        }
    }

    private getMutable(): Puzzle {
        return JSON.parse(JSON.stringify(this.bs.value));
    }

    private commit(puzzle: Puzzle) {
        localStorage.setItem("xw-puzzle", JSON.stringify(puzzle));
        this.bs.next(puzzle);
    }

    private findClue(puzzle: Puzzle, id: string): Clue {
        return puzzle.clues.find((clue) => clue.id === id);
    }

    private findCell(puzzle: Puzzle, id: string): GridCell {
        return puzzle.grid.cells.find((cell) => cell.id === id);
    }

    private clearHighlights(puzzle: Puzzle) {
        puzzle.clues.forEach((clue) => {
            clue.highlight = false;
        });
        puzzle.grid.cells.forEach((cell) => {
            cell.highlight = false;
        });
    }

    private highlightClue(puzzle: Puzzle, clue: Clue) {

        clue.highlight = true;
        clue.entries.forEach((entry) => {
            entry.cellIds.forEach((cellId) => {
                let cell = puzzle.grid.cells.find((cell) => cell.id === cellId);
                cell.highlight = true;
            });
        });
    }

    private getAcrossClues(puzzle: Puzzle): Clue[] {
        return puzzle.clues.filter((clue) => clue.group === "across");
    }

    private getDownClues(puzzle: Puzzle): Clue[] {
        return puzzle.clues.filter((clue) => clue.group === "down");
    }

    private findCellInFirstEntry(clues: Clue[], cellId: string): Clue {
        let result: Clue = null;

        for (let clue of clues) {
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
        return result;
    }

    private findCellInAnyEntry(clues: Clue[], cellId: string): Clue {
        let result: Clue = null;

        for (let clue of clues) {
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
        return result;
    }

    private updateGridText(puzzle: Puzzle) {

        // clear the grid
        puzzle.grid.cells.forEach(cell => cell.content = "");

        puzzle.clues.forEach((clue) => {
            let answer = clue.answer.toUpperCase().replace(/[^A-Z]/g, "");
            let index = 0;

            if (answer) {
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach((id) => {
                        let cell = puzzle.grid.cells.find(c => c.id === id);
                        if (index < answer.length) {
                            cell.content = answer.charAt(index);
                        }
                        index++;
                    });
                });
            }
        });
    }
}
