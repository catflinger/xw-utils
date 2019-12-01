import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { parseTokenTypes, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken } from './tokeniser/tokens';
import { IParseContext, ParseContext, TextParsingError } from './text-parsing-context';

export interface TextParsingOptions {
    allowPreamble?: boolean,
    allowPostamble?: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class TextParsingService {

    constructor(private tokeniser: TokeniserService) {}

    public *parser(data: ParseData, options: TextParsingOptions): IterableIterator<IParseContext> {

        const _options: TextParsingOptions = {
            allowPreamble: options && options.allowPreamble,
            allowPostamble: options && options.allowPostamble,
        }

        let context: ParseContext = new ParseContext();
        let tokens: TokenList = this.tokeniser.parse(data.rawData);

        let tokeniser = tokens.getIterator();
        let item = tokeniser.next();

        while(!item.done) {
            context.setGroup(item.value);

            switch (context.tokenGroup.current.type) {
                case parseTokenTypes.AcrossMarkerToken:
                    this.onAcrossMarker(context, _options);
                    break;
                case parseTokenTypes.DownMarkerToken:
                    this.onDownMarker(context, _options);
                    break;
                case parseTokenTypes.ClueToken:
                    this.onClueToken(context, _options);
                    break;
                case parseTokenTypes.ClueStartToken:
                    this.onClueStartToken(context, _options);
                    break;
                case parseTokenTypes.TextToken:
                    this.onTextToken(context, _options);
                    break;
                case parseTokenTypes.ClueEndToken:
                    this.onClueEndToken(context, _options);
                    break;
                default:
            }

            yield context;
            item = tokeniser.next();
            context.setGroup(item.value);
        }

        context.done = true;
        context.setGroup(null);
        return context;
    }

    private onAcrossMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as AcrossMarkerToken;

        switch (context.direction) {
            case null:
                context.direction = "across";
                break;

            case "across":
                throw new TextParsingError(token.lineNumber, token.text, "Found unexpected ACROSS marker");

            case "down":
                throw new TextParsingError(token.lineNumber, token.text, "Found ACROSS marker in the down clues");

            case "ended":
                if (!options.allowPostamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found ACROSS marker in the down clues");
                }
                break;
        }
    }

    private onDownMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as DownMarkerToken;

        switch (context.direction) {
            case "across":
                context.direction = "down";
                break;

            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found unexpected DOWN marker");
                }
                break;

            case "down":
                throw new TextParsingError(token.lineNumber, token.text, "Found DOWN marker in the down clues");

            case "ended":
                if (!options.allowPostamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found ACROSS marker in the down clues");
                }
                break;
        }
    }

    private onClueToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as ClueToken;

        switch (context.direction) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found start of clue before ACROSS or DOWN marker");
                }
                break;

            case "ended":
                if (!options.allowPostamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found clue after and of down clues");
                }
                break;

            case "across":
            case "down":
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
                break;
            }
    }

    private onClueStartToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as ClueStartToken;

        switch (context.direction) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found start of clue before ACROSS or DOWN marker");
                }
                break;

            case "across":
            case "down":
                if (!context.hasContent) {
                    context.addText(token.text);
                } else {
                    
                    // TO DO: same situation as in onClueToken()

                    throw new TextParsingError(token.lineNumber, token.text, "Found start of new clue when old clue not finished (2)");
                }
                break;

            case "ended": 
                if (!options.allowPostamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found clue start after end of down clues");
                }
                break;
        }
    }

    private onClueEndToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as ClueEndToken;

        switch (context.direction) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found end of clue before ACROSS or DOWN marker");
                }
                break;

            case "across":
            case "down":
                if (context.hasContent) {
                    context.addText(token.text);
                    context.save();
                } else {

                // TO DO: ask the user to fix this manually

                    throw new TextParsingError(token.lineNumber, token.text, "Found end of clue when no clue started");
                }
                break;

            case "ended":
                if (!options.allowPostamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found clue end after end of down clues");
                }
                break;
        }
    }
    
    private onTextToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as TextToken;

        switch (context.direction) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError(token.lineNumber, token.text, "Found start of clue before ACROSS or DOWN marker");
                }
                break;

            case "across":
                if (context.hasContent) {
                    context.addText(token.text);
                } else {
                    throw new TextParsingError(token.lineNumber, token.text, "Expected the start of a new clue");
                }
                break;

            case "down":
                if (context.hasContent) {
                    context.addText(token.text);
                } else {
                    if (options.allowPostamble) {
                        context.direction = "ended";
                    } else {
                        throw new TextParsingError(token.lineNumber, token.text, "Expected the start of a new clue");
                    }
                }
                break;
                
        }
    }
}
