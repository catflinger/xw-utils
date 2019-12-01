import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { Line } from './line';
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { parseTokenTypes, GroupMarkerToken, ClueToken, ClueStartToken, ClueEndToken, TextToken } from './tokeniser/tokens';
import { IParseContext, ParseContext, TextParsingError } from './text-parsing-context';

@Injectable({
    providedIn: 'root'
})
export class TextParsingService {

    constructor(private tokeniser: TokeniserService) {}

    public *parser(data: ParseData): IterableIterator<IParseContext> {

        // make an array of lines from the source data
        let lines: Line[] = [];
        data.rawData.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));

        // parse the lines into tokens
        let tokens: TokenList = this.tokeniser.parse(lines, { allowPreamble: false, allowPostamble: false});

        // now compile the tokens into clues for the puzzle
        let context: ParseContext = new ParseContext();
        let iterator = tokens.getIterator();
        let item = iterator.next();

        while(!item.done) {
            context.setGroup(item.value);

            switch (context.tokenGroup.current.type) {
                case parseTokenTypes.GroupMarkerToken:
                    this.onGroupMarker(context);
                    break;
                case parseTokenTypes.ClueToken:
                    this.onClueToken(context);
                    break;
                case parseTokenTypes.ClueStartToken:
                    this.onClueStartToken(context);
                    break;
                case parseTokenTypes.TextToken:
                    this.onTextToken(context);
                    break;
                case parseTokenTypes.ClueEndToken:
                    this.onClueEndToken(context);
                    break;
                default:
            }

            yield context;
            item = iterator.next();
            context.setGroup(item.value);
        }

        context.done = true;
        context.setGroup(null);
        return context;
    }

    private onGroupMarker(context: ParseContext) {
        const token = context.tokenGroup.current as GroupMarkerToken;

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

    private onClueToken(context: ParseContext) {
        const token = context.tokenGroup.current as ClueToken;

        if (!context.hasContent) {
            context.addText(token.text);
            context.save();
        } else {

            // TO DO: maybe 
            //      1) previous clue is missing letter count
            //      2) the current clue has a line-break that leaves a digit at teh start of the next line
            //
            // Look in the grid and try to find some supporting evidence for what is going on
            // and then either :
            //      1) auto-fix and alert he user
            //      2) carry on with a missing letter count
            //      3) give up and ask the user to fix it manually

            throw new TextParsingError(token.lineNumber, token.text, "Found start of new clue when old clue not finished (1)");
        }
    }

    private onClueStartToken(context: ParseContext) {
        const token = context.tokenGroup.current as ClueStartToken;

        if (!context.hasContent) {
            context.addText(token.text);
        } else {
            
            // TO DO: same situation as in onClueToken()

            throw new TextParsingError(token.lineNumber, token.text, "Found start of new clue when old clue not finished (2)");
        }
    }

    private onClueEndToken(context: ParseContext) {
        const token = context.tokenGroup.current as ClueEndToken;

        if (context.hasContent) {
            context.addText(token.text);
            context.save();

        } else {

        // TO DO: ask the user to fix this manually

            throw new TextParsingError(token.lineNumber, token.text, "Found end of clue when no clue started");
        }
    }
    
    private onTextToken(context: ParseContext) {
        const token = context.tokenGroup.current as TextToken;

        if (context.hasContent) {
            context.addText(token.text);
        } else {
            throw new TextParsingError(token.lineNumber, token.text, "Expected the start of a new clue");
        }
    }

}
