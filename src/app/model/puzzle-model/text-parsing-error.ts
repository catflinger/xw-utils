import { ITextParsingError, TextParsingErrorCode, ITextParsingWarning } from '../interfaces';
import { TokenGroup } from './token-group';

export class TextParsingError implements ITextParsingError {
    public readonly code: TextParsingErrorCode = null;
    public readonly tokens: TokenGroup = null;
    public readonly message: string = null;

    constructor(data: any) {
        if (data) {
            this.code = data.code;
            this.message = data.message;
            if (data.tokens) {
                this.tokens = data.tokens;
            }
        }
    }
}