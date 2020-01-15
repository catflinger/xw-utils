import { IPuzzleSource } from './interfaces';
import { TextParsingError } from './text-parsing-error';
import { TextParsingWarning } from './text-parsing-warning';

export class PuzzleSource implements IPuzzleSource {
    public readonly source: string;
    public readonly parseErrors: ReadonlyArray<TextParsingError>;
    public readonly parseWarnings: ReadonlyArray<TextParsingWarning>;

    constructor(data: any) {
        let errors: TextParsingError[] = [];
        let warnings: TextParsingWarning[] = [];

        if (data) {
            if (Array.isArray(data.parseErrors)) {
                data.parseErrors.forEach(error => errors.push( new TextParsingError(error)));
            }
            if (Array.isArray(data.parseWarnings)) {
                data.parseWarnings.forEach(warning => warnings.push( new TextParsingWarning(warning)));
            }
        }

        this.parseErrors = errors;
        this.parseWarnings = warnings;
        this.source = data.source;
        
    }
}