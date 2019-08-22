import { Injectable } from '@angular/core';
import { data } from "./data1";
import { Puzzle } from '../model/puzzle';

@Injectable({
    providedIn: 'root'
})
export class DevelopmentPuzzleSourceService {

    constructor() { }

    public getPuzzle(): Promise<Puzzle> {
        return Promise.resolve(new Puzzle(data));
    }

    public putPuzzle(puzzle: Puzzle): Promise<void> {
        return Promise.resolve();
    }
}
