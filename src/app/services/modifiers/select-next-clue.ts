import { IPuzzleModifier } from './puzzle-modifier';
import { IPuzzle } from 'src/app/model/interfaces';
import { Clear } from './clear';
import { PuzzleM } from './mutable-model/puzzle-m';

export class SelectNextClue implements IPuzzleModifier {
    constructor(public readonly clueId: string) { }

    exec(puzzle: PuzzleM) {
        new Clear().exec(puzzle);

        let index = puzzle.clues.findIndex((clue) => clue.id === this.clueId);
        if (index >= 0 && index + 1 < puzzle.clues.length) {
            puzzle.clues[index + 1].highlight = true;
        }
    }
}