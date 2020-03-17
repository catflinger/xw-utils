import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class SortClues implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.clues) {
            puzzle.clues.sort((a, b) => {
                //sort first by group
                let result = a.group.localeCompare(b.group);
                if (!result) {
                    //within a group sort clues in numerical order if possible
                    if (a.entries.length && b.entries.length) {
                        let gridRefA = a.entries[0].gridRef;
                        let gridRefB = b.entries[0].gridRef;

                        if (gridRefA && gridRefB) {
                            result = parseInt(gridRefA.caption) - parseInt(gridRefB.caption);
                        } else {
                            let result = a.caption.localeCompare(b.caption);
                        }
                    }
                }
                return result;
            });
        }
    }
}