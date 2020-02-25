import { ITextParsingError, TextParsingErrorCode, ITokenGroup } from 'src/app/model/interfaces';

export abstract class TextParsingErrorM implements ITextParsingError {
    public abstract code: TextParsingErrorCode;
    public abstract tokens: ITokenGroup;
    public abstract message: string;

}