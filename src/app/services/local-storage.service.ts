import { Injectable } from '@angular/core';
import { Puzzle, IPuzzle } from '../model/puzzle';
import { PuzzleInfo } from '../model/puzzle-info';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    public getLastest(): Promise<Puzzle> {
        let id = localStorage.getItem("xw-latest");
        return this.getPuzzle(id);
    }

    public deletePuzzle(id: string): Promise<void> {
        localStorage.removeItem("xw-puzzle-" + id);
        return Promise.resolve();
    }

    public listPuzzles(): PuzzleInfo[] {
        let result: PuzzleInfo[] = [];

        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key.startsWith("xw-puzzle-")) {
                let puzzle: any = JSON.parse(localStorage[key]);
                result.push(new PuzzleInfo(puzzle.info))
            }
        }

        return result;
    }

    public getPuzzle(id: string): Promise<Puzzle> {
        const json = localStorage.getItem("xw-puzzle-" + id);
        
        if (json) {
            return Promise.resolve(new Puzzle(JSON.parse(json)));
        } else {
            return Promise.resolve(null);
        }
    }

    public putPuzzle(puzzle: IPuzzle): Promise<any> {
        if (puzzle) {
            const json = JSON.stringify(puzzle);
            localStorage.setItem("xw-puzzle-" + puzzle.info.id, json);
            localStorage.setItem("xw-latest", puzzle.info.id);
        }

        return Promise.resolve();
    }

    public clearPuzzles() {
        localStorage.clear();
    }
}
