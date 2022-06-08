import { v4 as uuid } from "uuid";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../storage/local-storage.service';
import { Puzzle } from '../../model/puzzle-model/puzzle';
import { HttpPuzzleSourceService } from './http-puzzle-source.service';
import { Clear } from '../../modifiers/puzzle-modifiers/clear';
import { IPuzzleModifier } from '../../modifiers/puzzle-modifier';
import { PuzzleProvider, IPuzzleSummary, latestPuzzleVersion } from '../../model/interfaces';
import { InitAnnotationWarnings } from '../../modifiers/puzzle-modifiers/init-annotation-warnings';
import { OpenPuzzleParamters } from '../../ui/general/app.service';
import { AppResultSymbols } from '../common';
import { UpdateInfo } from '../../modifiers/puzzle-modifiers/update-info';
import { Grid } from '../../model/puzzle-model/grid';
import { AddGrid } from '../../modifiers/grid-modifiers/add-grid';
import { MarkAsCommitted } from '../../modifiers/puzzle-modifiers/mark-as-committed';
import { MarkAsUncommitted } from '../../modifiers/puzzle-modifiers/mark-as-uncommitted';
import { IPuzzle } from 'src/app/model/interfaces';
import { QuillDelta } from 'src/app/model/puzzle-model/quill-delta';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { RenumberGid } from "src/app/modifiers/grid-modifiers/renumber-grid";
import { SetGridCaptions } from "src/app/modifiers/grid-modifiers/set-grid-captions";
import { UpdateProvision } from "src/app/modifiers/puzzle-modifiers/update-provision";
import { fifteensquaredAnswerStyle, fifteensquaredClueStyle, fifteensquaredDefinitionStyle } from "src/app/model/puzzle-model/text-style";

// Note: using abstract classes rather than interfaces to enable them to be used
// as injection tokens in the Angular DI. Interfaces cannot be used directly as injection tokens.
// Avoiding custom InjectionTokens keeps the injection into components simple and readable.

export abstract class IActivePuzzle {
    abstract observe(): Observable<Puzzle>;
    abstract get puzzle(): Puzzle;
    abstract hasPuzzle: boolean;
    abstract clear(id?: string);
    abstract update(...reducers: IPuzzleModifier[]): void;
    abstract commit(): void;
    abstract discard(): void;
    abstract updateAndCommit(...reducers: IPuzzleModifier[]): void;
    abstract cloneAsGrid(): void;
}
export abstract class IPuzzleManager {
    // TO DO: rename these to make it clearer exactly what each one does
    // at teh moment some of the name sound quite similar
    abstract newPuzzle(provider: PuzzleProvider, reducers?: IPuzzleModifier[]): void;
    abstract observePuzzleList(): Observable<IPuzzleSummary[]>;
    abstract openPuzzle(id: string, modifiers?: IPuzzleModifier[]): Promise<Puzzle>;
    abstract openArchivePuzzle(params: OpenPuzzleParamters): Promise<Puzzle>;
    abstract loadPuzzleFromPdf(params: OpenPuzzleParamters): Promise<string>;

    abstract addPuzzle(Puzzle);
    abstract deletePuzzle(id: string): Promise<void>;

    abstract getPuzzleList(): IPuzzleSummary[];
}

@Injectable()
export class PuzzleManagementService implements IPuzzleManager, IActivePuzzle {

    private bsList: BehaviorSubject<IPuzzleSummary[]>;
    private bsActive: BehaviorSubject<Puzzle>;

    constructor(
        private localStorageService: LocalStorageService,
        private httpPuzzleService: HttpPuzzleSourceService,
        //private changeDetector: ChangeDetectorRef,
    ) {
        this.bsList = new BehaviorSubject<IPuzzleSummary[]>([]);
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
    // Also: think about moving the active puzzle into the nav service.  It might make moe sense to have an active puzle more
    // directly attached to a UI process.  This could allow for an MDI style UI.  Not required at the moment, but it feels cleaner.

    //#region Active Puzzle interface

    public observe(): Observable<Puzzle> {
        return this.bsActive.asObservable();
    }

    public get puzzle(): Puzzle {
        return this.bsActive.value;
    }

    public newPuzzle(provider: PuzzleProvider, reducers?: IPuzzleModifier[]): Puzzle {
        let result: Puzzle = null;

        let puzzle: Puzzle = this.makeEmptyPuzzle(provider);

        if (reducers) {
            reducers.forEach(reducer => reducer.exec(puzzle));
        }

        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();

        result = new Puzzle(puzzle);
        this.bsActive.next(result);

        return result;
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

    public update(...reducers: IPuzzleModifier[]): void {
        let puzzle = this.getMutableCopy(this.bsActive.value);
        //let puzzle = this.bsActive.value;

        if (puzzle) {
            reducers.forEach(reducer => reducer.exec(puzzle));
            new MarkAsUncommitted().exec(puzzle);
            this.bsActive.next(new Puzzle(puzzle));
        }
    }

    public commit() {
        let puzzle = this.getMutableCopy(this.bsActive.value);
        //let puzzle = this.bsActive.value;

        if (puzzle) {
            new MarkAsCommitted().exec(puzzle);
            puzzle.revision += 1;
            this.savePuzzle(puzzle);
            this.bsActive.next(new Puzzle(puzzle));
        }
    }

    public discard(): void {
        let puzzle = this.getMutableCopy(this.bsActive.value);

        if (puzzle) {
            this.openPuzzle(puzzle.info.id);
        }
    }

    public updateAndCommit(...reducers: IPuzzleModifier[]) {
        let puzzle = this.getMutableCopy(this.bsActive.value);
        //let puzzle = this.bsActive.value;

        if (puzzle) {
            reducers.forEach(reducer => {
                // console.log(`Executing modifier ${reducer.constructor.name}`);
                reducer.exec(puzzle);
            });
            new MarkAsCommitted().exec(puzzle);
            puzzle.revision += 1;
            this.savePuzzle(puzzle);
            
            const next = new Puzzle(puzzle)

            this.bsActive.next(next);
        }
    }

    public cloneAsGrid() {
        let puzzle = this.bsActive.value;

        if (puzzle) {
            let clone = this.getMutableCopy(this.newPuzzle("grid"));
            
            clone.info.title = "Copy of " + puzzle.info.title;
            clone.grid = puzzle.grid;
            clone.ready = true;
            
            this.savePuzzle(clone);
        }
    }
    //#endregion

    //#region General Puzzle management

    public observePuzzleList(): Observable<IPuzzleSummary[]> {
        return this.bsList.asObservable();
    }

    public getPuzzleList(): IPuzzleSummary[] {
        return this.bsList.value;
    }

    public openPuzzle(id: string, modifiers?: IPuzzleModifier[]): Promise<Puzzle> {
        return this.localStorageService.getPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {

                // TEMPORARY puzzle modofication for backward compatibility for existing puzzles from grid work June 2022
                // these modifiers can be removed after a few weeks
                let tempMods: IPuzzleModifier[] = [new RenumberGid(), new SetGridCaptions()];

                this.usePuzzle(puzzle, tempMods);
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
        let result;

        if (params.provider === "ft" || params.provider === "azed") {
            result = this.httpPuzzleService.providePuzzle(params).then(pdfExtract => {
                let reducers = [];

                reducers.push(new UpdateInfo({ source: pdfExtract.text }));
    
                if (pdfExtract.grid) {
                    let grid = new Grid(pdfExtract.grid);

                    reducers.push(
                        new AddGrid({ grid }),
                        new RenumberGid(),
                        new SetGridCaptions(),
                    );
                }
                return this.newPuzzle(params.provider, reducers);
            });
        } else {

            result = this.httpPuzzleService.getPuzzle(params).then((response) => {
                let puzzle = new Puzzle(response.puzzle);
                let puzzleM: IPuzzle = JSON.parse(JSON.stringify(puzzle));

                new InitAnnotationWarnings().exec(puzzleM);
                new RenumberGid().exec(puzzleM);

                if (params.provider === "independent" || params.provider === "ios") {
                    new SetGridReferences().exec(puzzleM);
                    new SetRedirects().exec(puzzleM);
                }

                this.localStorageService.putPuzzle(puzzleM);
                this.usePuzzle(puzzleM);
                this.refreshPuzzleList();

                return this.bsActive.value;
            })
            .catch(error => {
                throw error.message ? error.message : error.toString();
            });
        }

        return result;
    }

    public deletePuzzle(id: string): Promise<void> {
        return this.localStorageService.deletePuzzle(id)
            .then(() => {
                this.clear();
                this.refreshPuzzleList();
            });
    }

    public loadPuzzleFromPdf(params: OpenPuzzleParamters): Promise<string> {

        return this.httpPuzzleService.getPdfExtract(params.sourceDataB64, params.gridPage, params.textPage)
        .then((result) => {
            let reducers = [];

            reducers.push(new UpdateInfo({ source: result.text }));

            if (params.provisionOptions) {
                reducers.push(new UpdateProvision(params.provisionOptions));
            }

            if (result.grid) {
                let grid = new Grid(result.grid)
                reducers.push(new AddGrid({ grid }));
            }
            this.newPuzzle("pdf", reducers);

            return "ok";
        })
        .catch((error) => {
            if (error === AppResultSymbols.AuthorizationFailure) {
                return "authenticate";
            } else {
                throw error;
            }
        });
    }


    //#endregion

    //#region Private methods

    private refreshPuzzleList() {
        let list = this.localStorageService.listPuzzles();
        this.bsList.next(list);
    }

    private usePuzzle(puzzle: IPuzzle, modifiers?: IPuzzleModifier[]) {

        // reset to unused state
        new Clear().exec(puzzle);
        new MarkAsCommitted().exec(puzzle);

        if (modifiers) {
            modifiers.forEach(modifier => modifier.exec(puzzle));
        }

        this.bsActive.next(new Puzzle(puzzle));
    }

    private getMutableCopy(puzzle: Puzzle): IPuzzle {
        return JSON.parse(JSON.stringify(this.bsActive.value)) as IPuzzle;
    }

    private savePuzzle(puzzle: IPuzzle): void {
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
    }

    private makeEmptyPuzzle(provider: PuzzleProvider): Puzzle {
        return new Puzzle({
            clues: null,
            grid: null,
            version: latestPuzzleVersion,
            revision: 0,
            uncommitted: false,
            info: {
                id: uuid(),
                title: "",
                puzzleDate: new Date(),
                provider,
                setter: "anon", 
                wordpressId: null,
            },
            options: {
                linkMethod: "auto",
            },
            provision: {
                source: null,
                parseErrors: [],
                parseWarnings: [],
            },
            capability: {
                ready: false,
                blogable: false,
                solveable: false,
                gridable: false,
            },
            notes: {
                header: new QuillDelta(),
                body: new QuillDelta(),
                footer: new QuillDelta(),
            },
            publishOptions: {
                useThemeDefaults: true,
                textStyles: [
                    fifteensquaredClueStyle,
                    fifteensquaredAnswerStyle,
                    fifteensquaredDefinitionStyle,
                ],
                textCols: [
                    {
                        caption: "Entry",
                        style: "answer",
                    }
                ],
                includeGrid: false,
                layout: "table",
                spacing: "small",
            },
        });
    }

    //#endregion
}
