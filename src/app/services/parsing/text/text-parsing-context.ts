import { Clue } from '../../../model/clue';
import { TokenGroup } from './tokeniser/tokeniser.service';
import { QuillDelta, ClueGroup } from 'src/app/model/interfaces';
import { Line } from './line';

export type TextParsingState = "across" | "down" | "ended" | null;

export type TextParsingErrorCode =
    "exception" |
    // naming convention X_Y is: unexpected token X found while in parsing state Y 
    "acrossMarker_across" | 
    "acrossMarker_down" | 
    "acrossMarker_ended" | 

    "downMarker_null" | 
    "downMarker_across" | 
    "downMarker_down" | 
    "downMarker_ended" | 

    "endMarker_null" | 
    "endMarker_across" | 
    "endMarker_down" | 

    "clue_null" | 
    "clue_ended" | 
    "clue_acrossdown" | 

    "clueStart_null" | 
    "clueStart_ended" | 
    "clueStart_acrossdown" | 

    "clueEnd_null" | 
    "clueEnd_ended" | 
    "clueEnd_acrossdown" | 

    "text_null" | 
    "text_across" | 
    "text_down";

const marker = Symbol("TextParsingError");

export class TextParsingWarning {
    constructor(
        public readonly lineNumber: number,
        public readonly message: string,
    ) {}
}

export class TextParsingError {
    private marker: Symbol;

    constructor(
        public readonly code: TextParsingErrorCode,
        public readonly line: number,
        public readonly text: string,
        public readonly message: string,
    ){
        this.marker = marker;
    }

    static isTextParsingError(error: any) {
        return error && error.code === marker;
    }
}

export interface IParseContext {
    readonly state: TextParsingState;
    readonly clues: ReadonlyArray<Clue>;
    readonly buffer: string;
    readonly tokenGroup: TokenGroup;
    readonly error: TextParsingError;
    readonly warnings: ReadonlyArray<TextParsingWarning>;
}

export class ParseContext implements IParseContext {
    private _clueBuffer: string = null;
    private _clues: Clue[] = [];
    private _group: TokenGroup = null;
    private _state: TextParsingState = null;
    private _error: TextParsingError = null;
    private _warnings: TextParsingWarning[] = [];

    public addText(text: string) {
        if (!this._clueBuffer) {
            this._clueBuffer = text.trim();
        } else {
            this._clueBuffer += " " + text.trim();
        }
    }

    public addWarning(lineNumber: number, message: string) {
        this._warnings.push(new TextParsingWarning(lineNumber, message));
    }

    public get clues(): ReadonlyArray<Clue> { return this._clues; }
    public get warnings(): ReadonlyArray<TextParsingWarning> { return this._warnings; }

    public get hasContent(): boolean { return this._clueBuffer !== null; }
    public get buffer(): string { return this._clueBuffer; }

    public get tokenGroup(): TokenGroup { return this._group; } 
    public setGroup(group: TokenGroup): void { this._group = group; }

    public get state(): TextParsingState { return this._state } 
    public set state(state: TextParsingState) { this._state = state } 

    public get error(): TextParsingError { return this._error } 
    public set error(error: TextParsingError) { this._error = error } 

    public save(lineNumber: number) {

        // TO DO: fill in the missing properties on teh clue: letterCount for example
        //compileError - start again here

        let line: Line = new Line(this._clueBuffer, lineNumber);

        this._clues.push(new Clue({
            id: "",
            group: this.state,
            caption: ParseContext.readCaption(this._clueBuffer),
            text: this._clueBuffer,
            letterCount: "(5, 4)",
            answer: null,
            solution: null,
            annotation: null,
            redirect: false,
            format: null,
            comment: new QuillDelta(),
            highlight: false,
            entries: [],
            warnings: [], 
            chunks: [
                {
                    text: this.buffer,
                    isDefinition: false,
                }
            ],
        }));
        this._clueBuffer = null;
    }

    private static readCaption(text: string): string {

        if (!text || text.trim().length === 0) {
            return null;
        }

        // one or two digits
        const firstPart = String.raw`\d{1,2}`;
        
        // optional space, a comma, optional space, one or two digits, then an optioanl "across" or "down"
        const additionalPart = String.raw`\s*,\s*\d{1,2}(\s?(across)|(down))?`;
        
        // optional asterisk, optional space, (the first grid reference) then zero or more additional grid references
        const captionGroup = String.raw`(?<caption>\*?\s*${firstPart}(${additionalPart})*)`;
        
        // start of line, optional space, (the caption group)
        const expression = String.raw`^\s*${captionGroup}`;
        
        const regExp = new RegExp(expression, "i");
        const match = regExp.exec(text);

        //console.log("READING CAPTION " + match.groups.caption )

        return match.groups.caption;
    }


}
