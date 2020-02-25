import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';

export class AddTextColumn implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        puzzle.publishOptions.textCols.push({
            caption: "",
            style: "answer",
        });
    }
}