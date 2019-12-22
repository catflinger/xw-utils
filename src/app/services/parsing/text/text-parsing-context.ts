import { v4 as uuid } from "uuid";
import { Clue } from '../../../model/clue';
import { TokenGroup } from './tokeniser/tokeniser.service';
import { QuillDelta } from 'src/app/model/interfaces';

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

interface ClueTextParts {
    caption: string;
    clue: string;
}

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

        //let line: Line = new Line(this._clueBuffer, lineNumber);
        let parts: ClueTextParts = this.readCaption(this._clueBuffer);
        let letterCount = this.readLetterCount(this._clueBuffer);
        let format = this.makeAnswerFormat(letterCount);

        this._clues.push(new Clue({
            id: uuid(),
            group: this.state,
            caption: parts.caption,
            text: parts.clue,
            letterCount,
            answer: "",
            solution: "",
            annotation: null,
            redirect: false,
            format,
            comment: new QuillDelta(),
            highlight: false,
            entries: [],
            warnings: [], 
            chunks: [
                {
                    text: parts.clue,
                    isDefinition: false,
                }
            ],
        }));
        this._clueBuffer = null;
    }

    private readCaption(text: string): ClueTextParts {

        if (!text || text.trim().length === 0) {
            return null;
        }

        // one or two digits
        const firstPart = String.raw`\d{1,2}`;
        
        // optional space, a comma or slash, optional space, one or two digits, then an optioanl "across" or "down" or "/""
        const additionalPart = String.raw`\s*(,|/)\s*\d{1,2}(\s?(across)|(down))?`;
        
        // optional asterisk, optional space, (the first grid reference) then zero or more additional grid references
        const captionGroup = String.raw`(?<caption>\*?\s*${firstPart}(${additionalPart})*)`;
        
        // any characters up to the end of the line
        const clueGroup = String.raw`(?<clue>.*$)`;
        
        // start of line, optional space, (the caption group)
        const expression = String.raw`^\s*${captionGroup}${clueGroup}`;
        
        const regExp = new RegExp(expression);
        const match = regExp.exec(text);

        return {
            caption: match.groups.caption.trim(),
            clue: match.groups.clue.trim(),
        };
    }

    private readLetterCount(text: string): string {
        let result = null;

        const expression = String.raw`^(?<clue>.*)(?<letterCount>\([0-9-words, ]+?\)\s*$)`;

        const regExp = new RegExp(expression);
        const match = regExp.exec(text);

        if (match.groups["letterCount"]) {
            result = match.groups["letterCount"].trim();
        }

        return result;
    }


    private makeAnswerFormat(letterCount: string): string {
        let result: string = "";

        const startMarker = new RegExp(String.raw`^\(`);
        const endMarker = new RegExp(String.raw`\d words\)$`);

        let parts: string[] = letterCount
            .trim()
            .replace(startMarker, "")
            .trim()
            .replace(endMarker, "")
            .trim()
            .replace(")", "")
            .trim()
            .split(",");

        parts.forEach((part) => {
            let exp = new RegExp(/(\d{1,2})|([^0-9 ])/g);
            let match;

            if (part.trim().length > 0) {
                let partResult = "";

                while ((match = exp.exec(part)) !== null) {
                    if (match[1] !== null && match[1] !== undefined ) {
                        let count = parseInt(match[1]);
                        partResult += ",".repeat(count);
                    } else {
                        partResult += match[2];
                    }
                };

                if (partResult && result) {
                    result += "/";
                }
                result += partResult;

            }
        });

        return result;
    }
}
