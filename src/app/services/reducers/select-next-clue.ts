import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/puzzle';
import { ClearSelection } from './clear-selection';

export class SelectNextClue implements IReducer {
    constructor(public readonly clueId: string) { }

    exec(puzzle: IPuzzle) {
        new ClearSelection().exec(puzzle);

        let index = puzzle.clues.findIndex((clue) => clue.id === this.clueId);
        if (index >= 0 && index + 1 < puzzle.clues.length) {
            puzzle.clues[index + 1].highlight = true;
        }
    }
}