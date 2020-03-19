import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class ValidateLetterCounts implements IPuzzleModifier {
    public constructor() {}

    public exec(puzzle: PuzzleM) {
        if (puzzle && puzzle.clues && puzzle.grid) {
            puzzle.clues.forEach(clue => {
                let letterCountSum = this.sumLetterCounts(clue.letterCount);
                let cellCount = 0;

                clue.link.entries.forEach(entry => {
                    entry.cellIds.forEach(() => cellCount++);
                });

                if (cellCount != letterCountSum) {
                    clue.link.warning = `This clue has letter count (${clue.letterCount}) but has ${cellCount} cells the grid` ;
                } else {
                    clue.link.warning = null;
                }
            })
        }
    }

    private sumLetterCounts(letterCount: string): number {
        let result = 0;
        let groups = letterCount.split(",");

        groups.forEach((group) => {

            // ignore barred grid "2 words" annotations
            if (!/^\s*\d\s+words\s*$/i.test(group)) {

                let exp = /\d+/;
                let match: any[];

                while(match = exp.exec(group)) {
                    result += parseInt(match[0]);
                }
            }
        });

        return result;
    }
}