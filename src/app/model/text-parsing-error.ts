import { ITextParsingError, TextParsingErrorCode } from './interfaces';

const marker = Symbol("TextParsingError");

export class TextParsingError implements ITextParsingError {
    private marker: Symbol;
    public readonly code: TextParsingErrorCode = null;
    public readonly line: number = null;
    public readonly text: string = null;
    public readonly message: string = null;

    constructor(data: any){
        this.marker = marker;
        if (data) {
            this.code = data.code;
            this.line = data.line;
            this.text = data.text;
            this.message = data.message;
        }
    }

    static isTextParsingError(error: any) {
        return error && error.code === marker;
    }
}