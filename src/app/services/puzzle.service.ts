import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle, IPuzzle } from '../model/puzzle';

import { Clue, IClue, ClueValidationWarning } from '../model/clue';
import { TextStyleName } from '../ui/common';
import { PuzzleManagementService } from './puzzle-management.service';
import { TextChunk } from '../model/clue-text-chunk';
import { IReducer } from './reducers/reducer';
import { ClearSelection } from './reducers/clear-selection';
import { Validate } from './reducers/validate';

// This is a basic implimentation of an immutable store:
//      the model (Puzzle) is not to be changed by the application
//      changes are made only through public functions on this service
//      an new updated model is produced an added to the Behaviour Subject
//      application components listen for new models by subscribing to the BS

// TO DO: This might be better done using a storage framework such as Redux, but I don't have the time to learn a new framework right now.
// Once I get on top of the rest of the app then I might try and go back and retro fit Redux or similar later

@Injectable({
    providedIn: 'root'
})
export class PuzzleService {

    private bs: BehaviorSubject<Puzzle>;

    constructor(private puzzleManagement: PuzzleManagementService) {
        this.bs = new BehaviorSubject<Puzzle>(null);
    }

    public getObservable(): Observable<Puzzle> {
        return this.bs.asObservable();
    }

    public get hasPuzzle(): boolean {
        return !!(this.bs.value);
    }

    public usePuzzle(puzzle: Puzzle) {
        let iPuzzle = new Puzzle(JSON.parse(JSON.stringify(puzzle)));
        new ClearSelection().exec(iPuzzle);
        new Validate().exec(iPuzzle);

        this.bs.next(new Puzzle(iPuzzle));
    }

    public clearPuzzle(id?: string) {
        let current = this.bs.value;

        if (!id || (current && current.info.id === id)) {
            this.bs.next(null);
        }
    }

    public updatePuzzle(reducer: IReducer) {
        let puzzle = this.getMutable();

        if (puzzle) {
            reducer.exec(puzzle);
            this.commit(puzzle);
        }

    }

    private getMutable(): IPuzzle {
        return new Puzzle(JSON.parse(JSON.stringify(this.bs.value)));
    }

    private commit(puzzle: IPuzzle) {
        puzzle.revision += 1;
        const updated: Puzzle = new Puzzle(puzzle); 
        
        this.puzzleManagement.savePuzzle(updated);
        this.bs.next(updated);
    }
}
