import { ClueGroup } from "../../../model/interfaces";
import { Clue } from '../../../model/clue';
import { TokenGroup } from './tokeniser/tokeniser.service';

export class TextParsingError {
    constructor(
        public readonly line: number,
        public readonly text: string,
        public readonly message: string,
    ){}
}

export interface IParseContext {
    readonly done: boolean;
    readonly direction: string;
    readonly clues: ReadonlyArray<Clue>;
    readonly buffer: string;
    readonly tokenGroup: TokenGroup;
    readonly error: TextParsingError;
}

export class ParseContext implements IParseContext {
    private _clueBuffer: string = null;
    private _clues: Clue[] = [];
    private _group: TokenGroup = null;
    private _done: boolean;
    private _error: TextParsingError = null;

    public  direction: ClueGroup =  null;

    public addText(text: string) {
        if (this._clueBuffer === null) {
            this._clueBuffer = "";
        }
        this._clueBuffer += text;
    }

    public get clues(): ReadonlyArray<Clue> { return this._clues; }
    public get hasContent(): boolean { return this._clueBuffer !== null; }
    public get buffer(): string { return this._clueBuffer; }

    public get tokenGroup(): TokenGroup { return this._group; } 
    public setGroup(group: TokenGroup): void { this._group = group; }

    public get done(): boolean { return this._done } 
    public set done(done: boolean) { this._done = done } 

    public get error(): TextParsingError { return this._error } 
    public set error(error: TextParsingError) { this._error = error } 

    public save() {
        this._clues.push(new Clue({
            group: this.direction,
            entries: [],
            chunks: [],
            warnings: [],
            text: this._clueBuffer,
        }));
        this._clueBuffer = null;
    }
}
