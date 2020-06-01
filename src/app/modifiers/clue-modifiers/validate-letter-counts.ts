import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class ValidateLetterCounts implements IPuzzleModifier {
    public constructor() {}

    public exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.clues && puzzle.grid) {
            let grid = new Grid(puzzle.grid);

            puzzle.clues.forEach(clue => {
                let letterCountSum = this.sumLetterCounts(clue.letterCount);
                let cellCount = 0;

                clue.link.gridRefs.forEach(gridRef => {
                    let cells = grid.getGridEntryFromReference(gridRef);
                    if (cells.length) {
                        cells.forEach(() => cellCount++);
                    }
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
            const exp = new RegExp(String.raw`^\s*\d\s+words\s*$`, "i");
            if (!exp.test(group)) {

                let exp = /\d+/y;
                let match: any[];

                while(match = exp.exec(group)) {
                    result += parseInt(match[0]);
                }
            }
        });

        return result;
    }
}