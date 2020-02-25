import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { TextStyleName } from 'src/app/model/interfaces';

export class UpdatePublsihOptionTextStyle implements IPuzzleModifier {
    constructor(
        private textStyleName: TextStyleName, 
        private color: string, 
        private bold: boolean, 
        private italic: boolean, 
        private underline: boolean) { }

    exec(puzzle: PuzzleM) {
        let ts = puzzle.publishOptions[this.textStyleName];
        ts.color = this.color;
        ts.bold = this.bold;
        ts.italic = this.italic;
        ts.underline = this.underline;

    }
}