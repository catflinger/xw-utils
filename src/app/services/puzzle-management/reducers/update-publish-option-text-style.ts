import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/interfaces';
import { TextStyleName } from 'src/app/ui/common';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdatePublsihOptionTextStyle implements IReducer {
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