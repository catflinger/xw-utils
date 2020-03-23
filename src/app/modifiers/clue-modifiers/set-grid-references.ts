import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { ClueM } from '../mutable-model/clue-m';
import { ClueBuffer } from 'src/app/services/parsing/text/clue-buffer';

export class SetGridReferences implements IPuzzleModifier {
    constructor(private clueIds?: string[]) { }

    public exec(puzzle: PuzzleM) {
        if (puzzle.grid && puzzle.clues && puzzle.clues.length > 0) {
            let clues: ClueM[];

            if (!this.clueIds) {
                clues = puzzle.clues;
            } else {
                clues = [];
                this.clueIds.forEach(id => {
                    let clue = puzzle.clues.find(c => c.id === id);
                    if (clue) {
                        clues.push(clue);
                    }
                })
            }

            clues.forEach(clue => {
                clue.link.entries = [];
                let refs = ClueBuffer.makeGridReferences(clue.caption, clue.group);

                // TO DO: check that all clues except redirects have references?

                refs.forEach(ref => {
                    clue.link.entries.push({
                        gridRef: ref,
                        //cellIds: [],
                    });
                })
            });

        }
    }

}