import { Injectable } from '@angular/core';

import { Puzzle } from 'src/app/model/puzzle';
import { data } from "./data1";
import { promise } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class PuzzleStoreService {

    constructor() { }

    public getPuzzle(): Promise<Puzzle> {
        return Promise.resolve(data);
    }
}
