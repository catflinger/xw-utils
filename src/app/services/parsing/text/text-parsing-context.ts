import { Clue } from '../../../model/puzzle-model/clue';
import { ClueBuffer } from './clue-buffer';
import { TextParsingError } from 'src/app/model/puzzle-model/text-parsing-error';
import { TextParsingWarning } from 'src/app/model/puzzle-model/text-parsing-warning';
import { TokenGroup } from 'src/app/model/puzzle-model/token-group';
import { CaptionStyle } from 'src/app/model/interfaces';
import { TextParsingOptions } from './types';

export type TextParsingState = "across" | "down" | "ended" | null;

export interface IParseContext {
    readonly state: TextParsingState;
    readonly clues: ReadonlyArray<Clue>;
    readonly buffer: ClueBuffer;
    readonly preamble: ReadonlyArray<string>;
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
    private _preamble: string[] = [];

    constructor(
        public readonly textParsingOptions: TextParsingOptions,
    ) {}


    public addClueText(text: string) {
        if (this._state === "across" || this._state === "down") {
            if (!this._clueBuffer) {
                this._clueBuffer = new ClueBuffer(this.textParsingOptions.captionStyle, text, this._state);
            } else {
                this._clueBuffer.add(text);
            }
        } else {
            throw "Attempt to add clue text when not reading across or down clues.";
        }
    }

    public addWarning(lineNumber: number, message: string) {
        this._warnings.push(new TextParsingWarning({lineNumber, message}));
    }

    public addPreamble(text: string) {
        this._preamble.push(text);
    }

    public get clues(): ReadonlyArray<Clue> { return this._clues; }
    public get warnings(): ReadonlyArray<TextParsingWarning> { return this._warnings; }
    public get preamble(): ReadonlyArray<string> { return this._preamble; }

    public get hasContent(): boolean { return this._clueBuffer !== null; }
    public get buffer(): ClueBuffer { return this._clueBuffer; }

    public get tokenGroup(): TokenGroup { return this._group; } 
    public setGroup(group: TokenGroup): void { this._group = group; }

    public get state(): TextParsingState { return this._state } 
    public set state(state: TextParsingState) { this._state = state } 

    public get error(): TextParsingError { return this._error } 
    public set error(error: TextParsingError) { this._error = error } 

    public save() {

        if (this._state === "across" || this._state === "down") {
            this._clues.push(Clue.makeClue(
                this._clueBuffer.caption,
                this._clueBuffer.clue,
                this._clueBuffer.letterCount,
                this._state));
        }
        this._clueBuffer = null;
    }

    // private makeAnswerFormat(letterCount: string): string {
    //     let result: string = "";

    //     const startMarker = new RegExp(String.raw`^\(`);
    //     const endMarker = new RegExp(String.raw`\d words\)$`);

    //     let parts: string[] = letterCount
    //         .trim()
    //         .replace(startMarker, "")
    //         .trim()
    //         .replace(endMarker, "")
    //         .trim()
    //         .replace(")", "")
    //         .trim()
    //         .split(",");

    //     parts.forEach((part) => {
    //         let exp = new RegExp(/(\d{1,2})|([^0-9 ])/g);
    //         let match;

    //         if (part.trim().length > 0) {
    //             let partResult = "";

    //             while ((match = exp.exec(part)) !== null) {
    //                 if (match[1] !== null && match[1] !== undefined ) {
    //                     let count = parseInt(match[1]);
    //                     partResult += ",".repeat(count);
    //                 } else {
    //                     partResult += match[2];
    //                 }
    //             };

    //             if (partResult && result) {
    //                 result += "/";
    //             }
    //             result += partResult;

    //         }
    //     });

    //     return result;
    // }
}
