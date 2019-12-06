import { Clue } from '../../../model/clue';
import { TokenGroup } from './tokeniser/tokeniser.service';

export type TextParsingState = "across" | "down" | "ended" | null;

export type TextParsingErrorCode =
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
    private _state: TextParsingState;
    private _error: TextParsingError = null;
    private _warnings: TextParsingWarning[] = [];

    public addText(text: string) {
        if (this._clueBuffer === null) {
            this._clueBuffer = "";
        }
        this._clueBuffer += text;
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

    public save() {

        // TO DO: fill in the missing properties on teh clue: letterCount for example
        //compileError - start again here

        this._clues.push(new Clue({
            group: this.state,
            entries: [],
            chunks: [
                {
                    text: this.buffer,
                    isDefinition: false,
                }
            ],
            warnings: [],
            text: this._clueBuffer,
        }));
        this._clueBuffer = null;
    }
}
