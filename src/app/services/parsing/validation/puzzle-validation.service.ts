import { Injectable } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';

@Injectable({
    providedIn: 'root'
})
export class PuzzleValidationService {

    constructor() { }

    public validate(puzzle: Puzzle) {
        
        // IF WE HAVE A GRID
        // 1. Check every clue number is in the grid
        // 2. Check every grid entry has a clue

        // TO DO: why am I doing this?  Will a puzzle evr make it through the linker with these errors?

        // IF WE HAVE NO GRID
    }
}
