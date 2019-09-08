import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle, IPuzzle } from '../model/puzzle';

import { ClueUpdate } from './clue-update';
import { Clue, IClue } from '../model/clue';
import { TextStyle } from '../model/text-style';
import { TextStyleName } from '../ui/common';
import { LocalStorageService } from './local-storage.service';
import { HttpPuzzleSourceService } from './http-puzzle-source.service';
import { PuzzleInfo } from '../model/puzzle-info';

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
    private bsList: BehaviorSubject<PuzzleInfo[]>;

    constructor(
        private httpPuzzleService: HttpPuzzleSourceService,
        private localStorageService: LocalStorageService,
    ) {
        this.bs = new BehaviorSubject<Puzzle>(null);
        this.bsList = new BehaviorSubject<PuzzleInfo[]>([]);
         this.refreshPuzzleList();
    }

    public getObservable(): Observable<Puzzle> {
        return this.bs.asObservable();
    }

    public getListObservable(): Observable<PuzzleInfo[]> {
        return this.bsList.asObservable();
    }

    public get hasPuzzle(): boolean {
        return !!(this.bs.value);
    }

    public loadLatestPuzzle(): Promise<Puzzle> {
        return this.localStorageService.getLastest()
        .then(puzzle => {
            this.bs.next(puzzle);
            return puzzle;
        });
    }

    public loadSavedPuzzle(id: string): Promise<Puzzle> {
        return this.localStorageService.getPuzzle(id)
        .then((puzzle) => {
            this.localStorageService.putPuzzle(puzzle);
            this.bs.next(puzzle);
            return puzzle;
        });
    }

    public deletePuzzle(id: string): Promise<void> {
        return this.localStorageService.deletePuzzle(id)
        .then(() => {

            let current = this.bs.value;

            if (current && current.info.id === id) {
                this.bs.next(null);
            }

            this.refreshPuzzleList();
        });
    }

    public loadNewPuzzle(providerName: string, options?: any): Promise<Puzzle> {
        return this.httpPuzzleService.getPuzzle(providerName)
        .then((puzzle) => {
            this.localStorageService.putPuzzle(puzzle);
            this.bs.next(puzzle);

            this.refreshPuzzleList();

            return puzzle;
        })
        .catch((error) => {
            console.log("Failed to get puzzle:" + error.toString());
            throw new Error("Failed to load puzzle from " + providerName);
        });
    }

    public clearSelection() {
        let puzzle = this.getMutable();

        if (puzzle) {
            this.clearHighlights(puzzle);
            this.commit(puzzle);
        }
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

    public selectNextClue(clueId: string) {
        let puzzle = this.getMutable();

        if (puzzle) {
            this.clearHighlights(puzzle);

            let index = puzzle.clues.findIndex((clue) => clue.id === clueId);
            if (index >= 0 && index + 1 < puzzle.clues.length) {
                puzzle.clues[index + 1].highlight = true;
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
                clue.chunks = delta.chunks;

                this.updateGridText(puzzle);

                this.commit(puzzle);
            }
        }
    }

    public updatePreamble(header: string, body: string) {
        let puzzle = this.getMutable();

        if (puzzle) {
            puzzle.notes.header = header;
            puzzle.notes.body = body;

            this.commit(puzzle);
        }
    }

    public updatePublishOptionTextStyle(textStyleName: TextStyleName, color: string, bold: boolean, italic: boolean, underline: boolean) {
        let puzzle = this.getMutable();

        if (puzzle) {

            let ts = puzzle.publishOptions[textStyleName];
            ts.color = color;
            ts.bold = bold;
            ts.italic = italic;
            ts.underline = underline;

            this.commit(puzzle);
        }
    }

    private getMutable(): IPuzzle {
        return new Puzzle(JSON.parse(JSON.stringify(this.bs.value)));
    }

    private commit(puzzle: IPuzzle) {
        puzzle.revision += 1;
        this.localStorageService.putPuzzle(puzzle);
        this.bs.next(new Puzzle(puzzle));
    }

    private clearHighlights(puzzle: IPuzzle) {
        puzzle.clues.forEach((clue) => {
            clue.highlight = false;
        });

        if (puzzle.grid) {
            puzzle.grid.cells.forEach((cell) => {
                cell.highlight = false;
            });
        }
    }

    private highlightClue(puzzle: IPuzzle, clue: IClue) {

        clue.highlight = true;
        clue.entries.forEach((entry) => {
            entry.cellIds.forEach((cellId) => {
                let cell = puzzle.grid.cells.find((cell) => cell.id === cellId);
                cell.highlight = true;
            });
        });
    }

    private getAcrossClues(puzzle: IPuzzle): Clue[] {
        return puzzle.clues.filter((clue) => clue.group === "across");
    }

    private getDownClues(puzzle: IPuzzle): Clue[] {
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

    // private updateGridText(puzzle: Puzzle) {
    private updateGridText(puzzle: any) {
        if (!puzzle.grid) {
            return;
        }
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

    private refreshPuzzleList() {
        let list = this.localStorageService.listPuzzles();
        this.bsList.next(list);
    }
}
