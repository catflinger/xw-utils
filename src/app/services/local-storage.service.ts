import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    public getPuzzle(): Promise<Puzzle> {

        const json = localStorage.getItem("xw-puzzle");
        
        if (json) {
            return Promise.resolve(new Puzzle(JSON.parse(json)));
        } else {
            return Promise.resolve(null);
        }
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        const json = JSON.stringify(puzzle);
        localStorage.setItem("xw-puzzle", json);
        return Promise.resolve();
    }

    public clearPuzzles() {
        localStorage.clear();
    }
}
