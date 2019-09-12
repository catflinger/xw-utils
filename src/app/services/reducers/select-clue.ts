import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/interfaces';
import { ClearSelection } from './clear-selection';

export class SelectClue implements IReducer {
    constructor(public readonly clueId: string) { }

    exec(puzzle: IPuzzle) {
        if (puzzle) {
            let red = new ClearSelection();
            red.exec(puzzle);

            let clue = puzzle.clues.find((clue) => clue.id === this.clueId);
            if (clue) {
                clue.highlight = true;
                clue.entries.forEach((entry) => {
                    entry.cellIds.forEach((cellId) => {
                        let cell = puzzle.grid.cells.find((cell) => cell.id === cellId);
                        cell.highlight = true;
                    });
                });
            }
        }
    }
}