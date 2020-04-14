import { Injectable } from '@angular/core';
import { Puzzle } from '../../model/puzzle';
import { IPuzzle, IPuzzleSummary } from '../../model/interfaces';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    public getUserSettings(): string {
        try {
            return localStorage.getItem("xw-user-settings");
        } catch(error) {
            return null;
        }
    }

    public saveUserSettings(settings: string) {
        try {
            localStorage.setItem("xw-user-settings", settings);
        } catch(error) {
        }
    }

    public deletePuzzle(id: string): Promise<void> {
        localStorage.removeItem("xw-puzzle-" + id);
        return Promise.resolve();
    }

    public listPuzzles(): IPuzzleSummary[] {
        let result: IPuzzleSummary[] = [];

        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key.startsWith("xw-puzzle-")) {
                let data: any = JSON.parse(localStorage[key]);
                
                // load as new puzzle to ensure backward-compatibity conversions are run
                // TO DO: can remove this along with other backward compats once the app has been stable for a while
                let puzzle = new Puzzle(data);

                result.push({
                    info: puzzle.info,
                    capability: puzzle.capability
                });
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
        }

        return Promise.resolve();
    }

    public clearPuzzles() {
        localStorage.clear();
    }
}
