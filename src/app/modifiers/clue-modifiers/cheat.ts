import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { IClue } from '../../model/interfaces';


export class Cheat implements IPuzzleModifier {
    constructor(private clueIds?: string[]) { }

    public exec(puzzle: IPuzzle) {

        if (puzzle && puzzle.clues && puzzle.clues.length > 0) {
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
                if (clue.solution) {
                    if (!Array.isArray(clue.answers) || clue.answers.length === 0) {
                        clue.answers = [""];
                    }
                    clue.answers[0] = clue.solution;
                }
            });

        }
    }

}