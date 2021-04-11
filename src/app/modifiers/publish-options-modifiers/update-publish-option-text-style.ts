import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { TextStyleName } from 'src/app/model/interfaces';

export class UpdatePublsihOptionTextStyle implements IPuzzleModifier {
    constructor(
        private textStyleName: TextStyleName, 
        private color: string, 
        private bold: boolean, 
        private italic: boolean, 
        private underline: boolean) { }

    exec(puzzle: IPuzzle) {
        let ts = puzzle.publishOptions.textStyles.find(ts => ts.name === this.textStyleName);
        ts.color = this.color;
        ts.bold = this.bold;
        ts.italic = this.italic;
        ts.underline = this.underline;
    }
}