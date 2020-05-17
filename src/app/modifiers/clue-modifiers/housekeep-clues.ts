import { IPuzzle } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';

export class HousekeepClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.clues) {
            puzzle.clues = puzzle.clues.filter(clue => clue.text.trim().length > 0 );
        }
    }
}