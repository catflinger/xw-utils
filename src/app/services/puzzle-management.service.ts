import { v4 as uuid } from "uuid";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PuzzleInfo } from '../model/puzzle-info';
import { LocalStorageService } from './local-storage.service';
import { Puzzle } from '../model/puzzle';
import { HttpPuzzleSourceService, PuzzleResponse } from './http-puzzle-source.service';
import { Clear } from './modifiers/clear';
import { IPuzzleModifier } from './modifiers/puzzle-modifier';
import { IPuzzle, QuillDelta, Base64Encoded } from '../model/interfaces';
import { PuzzleM } from './modifiers/mutable-model/puzzle-m';
import { AddPlaceholders } from './modifiers/add-placeholders';
import { OpenPuzzleParamters } from '../ui/services/app.service';
import { ApiResponseStatus, ApiSymbols } from './common';
import { UpdateInfo } from './modifiers/update-info';
import { Grid } from '../model/grid';
import { AddGrid } from './modifiers/add-grid';

// Note: using abstract classes rather than interfaces to enable them to be used
// as injection tokens in the Angular DI. Interfaces cannot be used directly as injection tokens.
// Avoiding custom InjectionTokens keeps the injection into components simple and readable.

export abstract class IActivePuzzle {
    abstract observe(): Observable<Puzzle>;
    abstract get puzzle(): Puzzle;
    abstract hasPuzzle: boolean;
    abstract clear(id?: string);
    abstract update(reducer: IPuzzleModifier): any;
}
export abstract class IPuzzleManager {
    // TO DO: rename these to make it clearer exactly what each one does
    // at teh moment some of the name sound quite similar
    abstract newPuzzle(reducer?: IPuzzleModifier): void;
    abstract getPuzzleList(): Observable<PuzzleInfo[]>;
    abstract openPuzzle(id: string): Promise<Puzzle>;
    abstract openArchivePuzzle(params: OpenPuzzleParamters): Promise<Puzzle>;
    abstract loadPuzzleFromPdf(pdf: Base64Encoded): Promise<string>;

    abstract addPuzzle(Puzzle);
    abstract deletePuzzle(id: string): Promise<void>;
}

@Injectable()
export class PuzzleManagementService implements IPuzzleManager, IActivePuzzle {

    private bsList: BehaviorSubject<PuzzleInfo[]>;
    private bsActive: BehaviorSubject<Puzzle>;

    constructor(
        private localStorageService: LocalStorageService,
        private httpPuzzleService: HttpPuzzleSourceService,
    ) {
        this.bsList = new BehaviorSubject<PuzzleInfo[]>([]);
        this.bsActive = new BehaviorSubject<Puzzle>(null);
        this.refreshPuzzleList();
    }

    // TO DO
    // Note on interfaces:
    // This class is doing two things: providing management of the active puzzle
    // and providing management of the stored puzzles. Some refactoring seems necessary.
    //
    // So far my attempts to split this into an ActivePuzzle and a 
    // PuzzleManager have resulted in cyclic dependencies.  Working around this
    // has just resulted in moving the code-smell somewhere else.  The two functions
    // operate as a pair.
    //
    // For example: the PuzzleManager needs to reference the ActivePuzzleManager whenver a new puzzle
    // is loaded form storage; the ActivePuzzleManager needs to refernce the PuzzleManager to 
    // updated the stored puzzle when the active puzzle is modified (to permanently save changes).
    //
    // Note on behaviour subjects:
    // The two behaviour subjects tend to be used independently, but their behaviour is not independent. Some actions
    // cause just one bs to emit a new value, some cause both to emit.  Combining these
    // into a single observable might make sense, but the individual application components typically only depend
    // on one of these, not both. Observing a combined observable just result in unnecessary
    // updates of the component when nothing they are using has changed.
    //
    // I have not run out of ideas yet, just paused this until I have more time to look at it again.
    //
    //  Next idea is to have the puzzle manager obsserve the active puzzle for changes.  Whenever a new active
    //  puzzle is emitted the manager saves it. I am not sure  yet if this a good idea.
    //
    //  Another idea is to have the on or both of the classes reference an interface rather than the concrete class.  Perhaps
    //  this will avoid the cyclic dependency.
    //

    //#region Active Puzzle interface

    public observe(): Observable<Puzzle> {
        return this.bsActive.asObservable();
    }

    public get puzzle(): Puzzle {
        return this.bsActive.value;
    }

    public newPuzzle(reducer?: IPuzzleModifier): void {
        let puzzle: PuzzleM = this.makeEmptyPuzzle();

        if (reducer) {
            reducer.exec(puzzle);
        }
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
        this.bsActive.next(new Puzzle(puzzle));
    }

    public get hasPuzzle(): boolean {
        return !!(this.bsActive.value);
    }

    public clear(id?: string) {
        let current = this.bsActive.value;

        if (!id || (current && current.info.id === id)) {
            this.bsActive.next(null);
        }
    }

    public update(reducer: IPuzzleModifier) {
        let puzzle = this.getMutableCopy(this.bsActive.value);

        if (puzzle) {
            const cancel = reducer.exec(puzzle);
            
            if (!cancel) {
                this.commit(puzzle);
            }
        }
    }

    //#endregion

    //#region General Puzzle management

    public getPuzzleList(): Observable<PuzzleInfo[]> {
        return this.bsList.asObservable();
    }

    public openPuzzle(id: string): Promise<Puzzle> {
        return this.getSavedPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {
                this.usePuzzle(puzzle);
            }
            return puzzle;
        });
    }

    public addPuzzle(puzzle: Puzzle) {
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
        this.usePuzzle(puzzle);
    }

    public openArchivePuzzle(params: OpenPuzzleParamters): Promise<Puzzle> {
        return this.httpPuzzleService.getPuzzle(params)
        .then((response) => {
            if (Array.isArray(response.warnings)) {
                //response.warnings.forEach(warning => console.log("WARNING " + JSON.stringify(warning))); 
            }

            let puzzle = new Puzzle(response.puzzle);

            // add some defaults
            let puzzleM: PuzzleM = JSON.parse(JSON.stringify(puzzle));
            new AddPlaceholders().exec(puzzleM);

            this.localStorageService.putPuzzle(puzzleM);
            this.usePuzzle(puzzleM);
            this.refreshPuzzleList();

            return this.bsActive.value;
        })
        .catch(error => {
            throw error.message ? error.message : error.toString();
        });
    }

    public deletePuzzle(id: string): Promise<void> {
        return this.localStorageService.deletePuzzle(id)
            .then(() => {
                this.clear();
                this.refreshPuzzleList();
            });
    }

    public loadPuzzleFromPdf(pdf: Base64Encoded): Promise<string> {

        return this.httpPuzzleService.getPdfExtract(pdf)
        .then((result) => {

            if (result.success === ApiResponseStatus.OK) {
                this.newPuzzle();

                this.update(new UpdateInfo({ source: result.text }));

                if (result.grid) {
                    let grid = new Grid(result.grid)
                    this.update(new AddGrid({ grid }));
                }
                return "ok";
            } else {
                return "error";
            }

        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
                return "authenticate";
            } else {
                return "error";
            }
        });
    }

    //#endregion

    //#region Private methods

    private refreshPuzzleList() {
        let list = this.localStorageService.listPuzzles();
        this.bsList.next(list);
    }

    private usePuzzle(puzzle: IPuzzle) {
        // create a mutable copy
        let puzzleM: PuzzleM = JSON.parse(JSON.stringify(puzzle));

        // modify it
        new Clear().exec(puzzleM);

        // push a read-only version
        this.bsActive.next(new Puzzle(puzzleM));
    }

    private getMutableCopy(puzzle: Puzzle): PuzzleM {
        return JSON.parse(JSON.stringify(this.bsActive.value)) as PuzzleM;
    }

    private commit(puzzle: PuzzleM) {
        puzzle.revision += 1;
        
        this.savePuzzle(puzzle);
        this.bsActive.next(new Puzzle(puzzle));
    }

    private getSavedPuzzle(id: string): Promise<Puzzle> {
        return this.localStorageService.getPuzzle(id)
            .then((puzzle) => {
                this.localStorageService.putPuzzle(puzzle);
                return puzzle;
            });
    }

    private savePuzzle(puzzle: IPuzzle): void {
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
    }

    private makeEmptyPuzzle(): PuzzleM {
        return {
            clues: [],
            grid: null,
            linked: false,
            revision: 0,
            info: {
                id: uuid(),
                title: "untitled",
                puzzleDate: new Date(),
                provider: "text",
                setter: "anon", 
                wordpressId: null,
                blogable: true,
                solveable: false,
                gridable: false,
                source: null,
            },
            notes: {
                header: new QuillDelta(),
                body: new QuillDelta(),
                footer: new QuillDelta(),
            },
            publishOptions: {
                clueStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                answerStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                definitionStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                includeGrid: false,
                layout: "table",
                spacing: "small",
            },
        };
    }

    //#endregion
}
