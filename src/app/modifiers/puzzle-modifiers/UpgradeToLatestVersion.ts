import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, latestPuzzleVersion } from '../../model/interfaces';
import { SetGridReferences } from '../clue-modifiers/set-grid-references';

export class UpgradeToLatestVersion implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle.version === latestPuzzleVersion) {
            // nothing to do
        } else if (puzzle.version === 0) {
            new SetGridReferences().exec(puzzle);
            puzzle.version = 1;
        } else {
            //TO DO: what to do here??
        }


    }
}