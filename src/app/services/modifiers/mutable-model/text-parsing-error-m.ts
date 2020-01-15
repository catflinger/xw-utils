import { ITextParsingError, TextParsingErrorCode } from 'src/app/model/interfaces';

export abstract class TextParsingErrorM implements ITextParsingError {
    public abstract code: TextParsingErrorCode;
    public abstract line: number;
    public abstract text: string;
    public abstract message: string;

}