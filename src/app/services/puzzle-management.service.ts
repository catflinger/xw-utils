import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PuzzleInfo } from '../model/puzzle-info';
import { LocalStorageService } from './local-storage.service';
import { Puzzle, IPuzzle } from '../model/puzzle';
import { HttpPuzzleSourceService } from './http-puzzle-source.service';
import { ClearSelection } from './reducers/clear-selection';
import { Validate } from './reducers/validate';
import { IReducer } from './reducers/reducer';

// Note: using abstract classes rather than interfaces to enable them to be used
// as injection tokens in the Angular DI. Interfaces cannot be used directly as injection tokens.
// Avoiding custom InjectionTokens keeps the injection into components simple and readable.

export abstract class IActivePuzzle {
    abstract observe(): Observable<Puzzle>;
    abstract hasPuzzle: boolean;
    abstract clear(id?: string);
    abstract update(reducer: IReducer);
}
export abstract class IPuzzleManager {
    abstract getPuzzleList(): Observable<PuzzleInfo[]>;
    abstract openPuzzle(id: string): Promise<Puzzle>;
    abstract openNewPuzzle(providerName: string, options?: any): Promise<Puzzle>;
    abstract deletePuzzle(id: string): Promise<void>;
}

@Injectable({
    providedIn: 'root'
})
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
    // So far my attempts to split this into an ActivePuzzleMager and a 
    // PuzzleManager have resulted in cyclic dependencies.  Working around this
    // has just resulted in moving the code-smell somewhere else.
    //
    // For example: the PuzzleManager needs to reference the ActivePuzzleManager whenver a new puzzle
    // is loaded form storage; the ActivePuzzleManager needs to refernce the PuzzleManager to 
    // updated the stored puzzle when the active puzzle is modified (to permanently save changes).
    //
    // Note on behaviour subjects:
    // The two behaviour subjects do not operate independently of each other.  Combining these
    // into a single observable might make sense, but the individual application components only ever depend
    // on one of these, not both. Observing a combined observable just result in unnecessary
    // updates of the component when nothing they are using has changed.

    //#region Active Puzzle management

    public observe(): Observable<Puzzle> {
        return this.bsActive.asObservable();
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

    public update(reducer: IReducer) {
        let puzzle = this.getMutableCopy(this.bsActive.value);

        if (puzzle) {
            reducer.exec(puzzle);
            this.commit(puzzle);
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

    public openNewPuzzle(providerName: string, options?: any): Promise<Puzzle> {
        return this.httpPuzzleService.getPuzzle(providerName)
            .then((puzzle) => {
                this.localStorageService.putPuzzle(puzzle);
                this.usePuzzle(puzzle);
                this.refreshPuzzleList();

                return puzzle;
            })
            .catch((error) => {
                console.log("Failed to get puzzle:" + error.toString());
                throw new Error("Failed to load puzzle from " + providerName);
            });
    }

    public deletePuzzle(id: string): Promise<void> {
        return this.localStorageService.deletePuzzle(id)
            .then(() => {
                this.clear();
                this.refreshPuzzleList();
            });
    }

    //#endregion

    //#region Private methods

    private refreshPuzzleList() {
        let list = this.localStorageService.listPuzzles();
        this.bsList.next(list);
    }

    private usePuzzle(puzzle: Puzzle) {
        let iPuzzle = new Puzzle(JSON.parse(JSON.stringify(puzzle)));
        new ClearSelection().exec(iPuzzle);
        new Validate().exec(iPuzzle);

        this.bsActive.next(new Puzzle(iPuzzle));
    }

    private getMutableCopy(puzzle: Puzzle): IPuzzle {
        return new Puzzle(JSON.parse(JSON.stringify(this.bsActive.value)));
    }

    private commit(puzzle: IPuzzle) {
        puzzle.revision += 1;
        const updated: Puzzle = new Puzzle(puzzle); 
        
        this.savePuzzle(updated);
        this.bsActive.next(updated);
    }

    private getSavedPuzzle(id: string): Promise<Puzzle> {
        return this.localStorageService.getPuzzle(id)
            .then((puzzle) => {
                this.localStorageService.putPuzzle(puzzle);
                return puzzle;
            });
    }

    private savePuzzle(puzzle: Puzzle): void {
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
    }

    //#endregion
}