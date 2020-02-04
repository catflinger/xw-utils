import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class InitAnnotationWarnings implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            if (puzzle.clues) {
                puzzle.clues.forEach(clue => clue.warnings = [ "missing answer", "missing comment", "missing definition"]);
            }
        }
    }
}