import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, latestPuzzleVersion } from '../../model/interfaces';
import { SetGridReferences } from '../clue-modifiers/set-grid-references';
import { GridLink } from 'src/app/model/puzzle-model/grid-link';

export class UpgradeToLatestVersion implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {

            if (puzzle.version === latestPuzzleVersion) {
                // nothing to do
            
            } else if (typeof puzzle.version === "undefined") {
                // this is an ealy puzzle, before versioning was introduced
                this.resetLink(puzzle);
                puzzle.version = 1;
            
            } else if (puzzle.version === 0) {
                // I don't think this was used live, but included here to help development
                this.resetLink(puzzle);
                puzzle.version = 1;

            } else {
                //TO DO: what to do here??
            }
        }
    }

    private resetLink(puzzle: IPuzzle) {
        puzzle.clues.forEach(clue => clue.link = new GridLink({}));
        new SetGridReferences().exec(puzzle);
    }
}