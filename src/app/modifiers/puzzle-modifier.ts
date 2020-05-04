
// TO DO: 1) Make teh modifiers into angular services so they are easy to test
// TO DO: 2) Consolidate the various update-xxxxx.ts modifiers into a single update modifier 

import { Puzzle } from '../model/puzzle-model/puzzle';

export interface IPuzzleModifier {
    
    // return any truthy value to cancel the update
    exec(puzzle: Puzzle): void;
};
