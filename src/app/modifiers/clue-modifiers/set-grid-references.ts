import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { IClue } from '../../model/interfaces';
import { ClueBuffer } from 'src/app/services/parsing/text/clue-buffer';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class SetGridReferences implements IPuzzleModifier {
    constructor(private clueIds?: string[]) { }

    public exec(puzzle: IPuzzle) {

        if (puzzle.grid && puzzle.clues && puzzle.clues.length > 0) {
            let clues: IClue[];

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
                clue.link.gridRefs = [];

                if (clue.caption && clue.group) {
                    let refs = ClueBuffer.makeGridReferences(clue.caption, clue.group, new Grid(puzzle.grid));

                    if (refs) {
                        refs.forEach(ref => {
                            clue.link.gridRefs.push(ref);
                        });
                    }
                }
            });

        }
    }

}