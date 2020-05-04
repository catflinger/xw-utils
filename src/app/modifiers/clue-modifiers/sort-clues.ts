import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class SortClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.clues) {
            puzzle.clues.sort((a, b) => {
                //sort first by group
                let result = a.group.localeCompare(b.group);
                if (!result) {
                    //within a group sort clues in numerical order if possible
                    if (a.link.entries.length && b.link.entries.length) {
                        let gridRefA = a.link.entries[0].gridRef;
                        let gridRefB = b.link.entries[0].gridRef;

                        if (gridRefA && gridRefB) {
                            result = gridRefA.caption - gridRefB.caption;
                        } else {
                            result = 0;
                        }
                    }
                }
                return result;
            });
        }
    }
}