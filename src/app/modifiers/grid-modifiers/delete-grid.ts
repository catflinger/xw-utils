import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class DeleteGrid implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            puzzle.grid = null;
            if (puzzle.clues) {
                puzzle.clues.forEach( clue => {
                    clue.link.entries = [];
                    clue.link.warning = null;
                });
            }
            puzzle.capability.gridable = false;
            puzzle.capability.solveable = false;
        }
    }
}