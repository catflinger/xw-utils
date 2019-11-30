import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { ParseResult } from './parse-result';
import { ClueGroup } from "../../../model/interfaces";
import { Line } from './line';
import { Clue } from '../../../model/clue';
import { TokeniserService, TokenList, TokenGroup } from './tokeniser/tokeniser.service';
import { Grid } from 'src/app/model/grid';
import { parseTokenTypes, GroupMarkerToken, ParseToken, ClueToken, ClueStartToken, ClueEndToken, TextToken } from './tokeniser/tokens';

class ParseContext {
    private _clueBuffer: string = null;
    private _clues: Clue[] = [];

    public  direction: ClueGroup =  null;

    public addText(text: string) {
        if (this._clueBuffer === null) {
            this._clueBuffer = "";
        }
        this._clueBuffer += text;
    }

    public get clues(): ReadonlyArray<Clue> { return this._clues; }
    public get hasContent(): boolean { return this._clueBuffer !== null; }

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

export class TextParsingError {
    constructor(
        public readonly line: number,
        public readonly text: string,
        public readonly message: string,
    ){}
}

@Injectable({
    providedIn: 'root'
})
export class TextParsingService {

    constructor(private tokeniser: TokeniserService) {}

    public parse(data: ParseData): ParseResult {
        let lines: Line[] = [];

            // fill the lines array fron the source data
            data.rawData.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));

            // parse the lines into tokens
            let tokens: TokenList = this.tokeniser.parse(lines, { allowPreamble: false, allowPostamble: false});

            // now compile the tokens into clues for the puzzle
            let context: ParseContext = this.compile(tokens, data.grid);

        let result = new ParseResult();
        result.clues = context.clues;

        return result;
    }

    private compile(tokens: TokenList, grid: Grid): ParseContext {
        let context: ParseContext = new ParseContext();

        let iterator = tokens.getIterator();
        let item = iterator.next();

        while(!item.done) {

            switch (item.value.current.type) {
                case parseTokenTypes.GroupMarkerToken:
                    this.onGroupMarker(context, item.value);
                    break;
                case parseTokenTypes.ClueToken:
                    this.onClueToken(context, item.value);
                    break;
                case parseTokenTypes.ClueStartToken:
                    this.onClueStartToken(context, item.value);
                    break;
                case parseTokenTypes.TextToken:
                    this.onTextToken(context, item.value);
                    break;
                case parseTokenTypes.ClueEndToken:
                    this.onClueEndToken(context, item.value);
                    break;
                default:
            }
            item = iterator.next();
        }

        return context;
    }

    private onGroupMarker(context: ParseContext, item: TokenGroup) {
        const token = item.current as GroupMarkerToken;

        if (context.direction === null && token.groupMarker === "across") {
            context.direction = "across";

        } else if (context.direction === null && token.groupMarker === "down") {
            throw new TextParsingError(token.lineNumber, token.text, "Found unexpected DOWN marker (1)");

        } else if (context.direction === "across" && token.groupMarker === "across") {
            throw new TextParsingError(token.lineNumber, token.text, "Found unexpected ACROSS marker");

        } else if (context.direction === "across" && token.groupMarker === "down") {
            context.direction = "down";

        } else if (context.direction === "down" && token.groupMarker === "across") {
            context.direction = "down";
            
        } else if (context.direction === "down" && token.groupMarker === "down") {
            throw new TextParsingError(token.lineNumber, token.text, "Found unexpected DOWN marker (2)");
        }
    }

    private onClueToken(context: ParseContext, item: TokenGroup) {
        const token = item.current as ClueToken;

        if (!context.hasContent) {
            context.addText(token.text);
            context.save();
        } else {
            throw new TextParsingError(token.lineNumber, token.text, "Found startof new clue when old clue not finished (1)");
        }
    }

    private onClueStartToken(context: ParseContext, item: TokenGroup) {
        const token = item.current as ClueStartToken;

        if (!context.hasContent) {
            context.addText(token.text);
        } else {
            throw new TextParsingError(token.lineNumber, token.text, "Found startof new clue when old clue not finished (2)");
        }
    }

    private onClueEndToken(context: ParseContext, item: TokenGroup) {
        const token = item.current as ClueEndToken;

        if (context.hasContent) {
            context.addText(token.text);
            context.save();

        } else {
            throw new TextParsingError(token.lineNumber, token.text, "Found enf of clue when no clue started");
        }
    }
    
    private onTextToken(context: ParseContext, item: TokenGroup) {
        const token = item.current as TextToken;

        if (context.hasContent) {
            context.addText(token.text);
        } else {
            throw new TextParsingError(token.lineNumber, token.text, "Expected the start of a new clue");
        }
    }

}
