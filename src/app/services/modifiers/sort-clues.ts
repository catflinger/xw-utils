import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class SortClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.clues) {
            puzzle.clues.sort((a, b) => a.group.localeCompare(b.group));
            puzzle.clues.sort((a, b) => parseInt(a.caption) - parseInt(b.caption));
        }
    }
}