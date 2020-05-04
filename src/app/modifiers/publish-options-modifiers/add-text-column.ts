import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';

export class AddTextColumn implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        puzzle.publishOptions.textCols.push({
            caption: "",
            style: "answer",
        });
    }
}