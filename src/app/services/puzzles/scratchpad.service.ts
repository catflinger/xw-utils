import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle } from '../../model/puzzle-model/puzzle';
import { IPuzzleModifier } from '../../modifiers/puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ScratchpadService {

    private bsActive: BehaviorSubject<Puzzle>;

    constructor(
    ) {
        this.bsActive = new BehaviorSubject<Puzzle>(null);
    }

    public observe(): Observable<Puzzle> {
        return this.bsActive.asObservable();
    }

    public get puzzle(): Puzzle {
        return this.bsActive.value;
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

        if (puzzle) {
            reducers.forEach(reducer => reducer.exec(puzzle));
            this.bsActive.next(new Puzzle(puzzle));
        }
    }


    public usePuzzle(puzzle: IPuzzle, modifiers?: IPuzzleModifier[]) {

        if (modifiers) {
            modifiers.forEach(modifier => modifier.exec(puzzle));
        }

        this.bsActive.next(new Puzzle(puzzle));
    }

    private getMutableCopy(puzzle: Puzzle): IPuzzle {
        return JSON.parse(JSON.stringify(this.bsActive.value)) as IPuzzle;
    }

}
