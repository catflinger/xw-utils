import { CaptionStyle, IPuzzleProvision } from '../interfaces';
import { TextParsingError } from './text-parsing-error';
import { TextParsingWarning } from './text-parsing-warning';

export class PuzzleProvision implements IPuzzleProvision {
    public readonly source: string;
    public readonly captionStyle: CaptionStyle;
    public readonly hasLetterCount: boolean;
    public readonly hasClueGroupHeadings: boolean;
    public readonly parseErrors: Array<TextParsingError>;
    public readonly parseWarnings: Array<TextParsingWarning>;

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

        this.captionStyle = data && data.captionStyle || "numbered";
        this.hasLetterCount = data && typeof data.hasLetterCount === "boolean" ? data.hasLetterCount : true;
        this.hasClueGroupHeadings = data && typeof data.hasClueGroupHeadings === "boolean" ? data.hasClueGroupHeadings : true;


    }
}