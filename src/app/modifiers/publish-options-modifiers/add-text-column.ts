import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle } from '../../model3/interfaces';

export class AddTextColumn implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        puzzle.publishOptions.textCols.push({
            caption: "",
            style: "answer",
        });
    }
}