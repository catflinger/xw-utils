import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { Clear } from '../puzzle-modifiers/clear';
import { IPuzzle } from '../../model3/interfaces';

export class SelectNextClue implements IPuzzleModifier {
    constructor(public readonly clueId: string) { }

    exec(puzzle: IPuzzle) {
        new Clear().exec(puzzle);

        let index = puzzle.clues.findIndex((clue) => clue.id === this.clueId);
        if (index >= 0 && index + 1 < puzzle.clues.length) {
            puzzle.clues[index + 1].highlight = true;
        }
    }
}