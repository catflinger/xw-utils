import { ITextParsingWarning } from '../interfaces';

export class TextParsingWarning implements ITextParsingWarning {
    public readonly lineNumber: number;
    public readonly message: string;
    
    constructor(data: any) {
        if (data) {
            this.lineNumber = data.lineNumber;
            this.message = data.message;
        }
    }
}