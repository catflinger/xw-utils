import { v4 as uuid } from "uuid";
import { Clue } from '../../../model/clue';
import { TokenGroup } from './tokeniser/tokeniser.service';
import { QuillDelta, ClueGroup } from 'src/app/model/interfaces';
import { Line } from './line';
import { ClueBuffer } from './clue-buffer';

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
    readonly buffer: ClueBuffer;
    readonly tokenGroup: TokenGroup;
    readonly error: TextParsingError;
    readonly warnings: ReadonlyArray<TextParsingWarning>;
}

export class ParseContext implements IParseContext {
    private _clueBuffer: ClueBuffer = null;
    private _clues: Clue[] = [];
    private _group: TokenGroup = null;
    private _state: TextParsingState = null;
    private _error: TextParsingError = null;
    private _warnings: TextParsingWarning[] = [];

    public addClueText(text: string) {
        if (this._state === "across" || this._state === "down") {
            if (!this._clueBuffer) {
                this._clueBuffer = new ClueBuffer(text, this._state);
            } else {
                this._clueBuffer.add(text);
            }
        } else {
            throw "Attempt to add clue text when not reading across or down clues.";
        }
    }

    public addWarning(lineNumber: number, message: string) {
        this._warnings.push(new TextParsingWarning(lineNumber, message));
    }

    public get clues(): ReadonlyArray<Clue> { return this._clues; }
    public get warnings(): ReadonlyArray<TextParsingWarning> { return this._warnings; }

    public get hasContent(): boolean { return this._clueBuffer !== null; }
    public get buffer(): ClueBuffer { return this._clueBuffer; }

    public get tokenGroup(): TokenGroup { return this._group; } 
    public setGroup(group: TokenGroup): void { this._group = group; }

    public get state(): TextParsingState { return this._state } 
    public set state(state: TextParsingState) { this._state = state } 

    public get error(): TextParsingError { return this._error } 
    public set error(error: TextParsingError) { this._error = error } 

    public save() {

        // TO DO: fill in the missing properties on teh clue: letterCount for example
        //compileError - start again here

        //let line: Line = new Line(this._clueBuffer, lineNumber);
        //let parts: ClueTextParts = this.readCaption(this._clueBuffer);
        //let letterCount = this.readLetterCount(this._clueBuffer);
        let format = this.makeAnswerFormat(this._clueBuffer.letterCount);

        this._clues.push(new Clue({
            id: uuid(),
            group: this.state,
            caption: this._clueBuffer.caption,
            text: this._clueBuffer.clue,
            letterCount: this._clueBuffer.letterCount,
            answer: "",
            solution: "",
            annotation: null,
            redirect: false,
            format,
            comment: new QuillDelta(),
            highlight: false,
            entries: [],
            warnings: [],
            gridRefs: this._clueBuffer.gridRefs,
            chunks: [
                {
                    text: this._clueBuffer.clue,
                    isDefinition: false,
                }
            ],
        }));
        this._clueBuffer = null;
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
