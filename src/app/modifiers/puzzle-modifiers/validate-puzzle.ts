import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class ValidatePuzzle implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {

            // TO DO: is there anything not clue-grid related to check?  title?

            // YES - redirects, ensure every clue marked as ridirect has a clue to go to

            if (puzzle.clues) {
                // TO DO: 
            }

            if (puzzle.grid) {
                // TO DO: 
            }

            if (puzzle.clues && puzzle.grid) {
                // TO DO: 
            }
        }

    }
}