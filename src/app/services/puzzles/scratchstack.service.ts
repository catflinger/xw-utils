import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle } from '../../model/puzzle-model/puzzle';
import { IPuzzleModifier } from '../../modifiers/puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ScratchstackService {

    //private bsActive: BehaviorSubject<Puzzle>;

    private stack: IPuzzle[] = [];

    constructor(
    ) {
        //this.bsActive = new BehaviorSubject<Puzzle>(null);
    }

    // public observe(): Observable<Puzzle> {
    //     return this.bsActive.asObservable();
    // }

    public start(puzzle: IPuzzle) {
        this.stack = [];
        this.stack.push(puzzle);
        // TO DO: fire an event
    }

    public pushChange(...reducers: IPuzzleModifier[]): void {
        let puzzle = this.getMutableCopy(this.stack[this.stack.length - 1]);

        if (puzzle) {
            reducers.forEach(reducer => reducer.exec(puzzle));
        }

        this.stack.push(puzzle);
    }


    public usePuzzle(puzzle: IPuzzle, modifiers?: IPuzzleModifier[]) {

        if (modifiers) {
            modifiers.forEach(modifier => modifier.exec(puzzle));
        }

        this.bsActive.next(new Puzzle(puzzle));
    }

    private getMutableCopy(puzzle: Puzzle | IPuzzle): IPuzzle {
        return JSON.parse(JSON.stringify(puzzle)) as IPuzzle;
    }

}
