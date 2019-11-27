import { IParseWarning } from './interfaces';

export class ParseWarning implements IParseWarning {
    public readonly answer: string;
    public readonly clue: string;
    public readonly lineNumber: number;
    public readonly reason: string;

    constructor(data: any) {
        if (data) {
            this.answer = data.answer;
            this.clue = data.clue;
            this.lineNumber = data.lineNumber;
            this.reason = data.reason;
        }
    }
}