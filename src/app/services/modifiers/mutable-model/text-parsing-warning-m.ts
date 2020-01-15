import { ITextParsingWarning } from 'src/app/model/interfaces';

export abstract class TextParsingWarningM implements ITextParsingWarning {
    public abstract lineNumber: number;
    public abstract message: string;

}