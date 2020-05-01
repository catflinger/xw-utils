import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';
import { Grid } from 'src/app/model/grid';

export class SyncGridContent implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (!puzzle || !puzzle.clues || !puzzle.grid) {
            return;
        }

        let grid: Grid = new Grid(puzzle.grid);

        // clear the grid
        puzzle.grid.cells.forEach(cell => cell.content = "");

        puzzle.clues.forEach((clue) => {
            let answer = clue.answers[0].toUpperCase().replace(/[^A-Z]/g, "");
            let index = 0;

            if (answer) {
                clue.link.entries.forEach((entry) => {
                    grid.getGridEntryFromReference(entry.gridRef)
                    .map(cell => cell.id)
                    .forEach(id => {
                        let cell = puzzle.grid.cells.find(c => c.id === id);
                        if (index < answer.length) {
                            cell.content = answer.charAt(index);
                        }
                        index++;
                    });
                });
            }
        });
    }
}