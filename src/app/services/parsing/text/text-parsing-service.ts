import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { parseTokenTypes, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, EndMarkerToken } from './tokeniser/tokens';
import { IParseContext, ParseContext, TextParsingError } from './text-parsing-context';

const hints = {
    missingLetterCount: "Does the previous clue have a missing or incomplete letter count?"
}

export interface TextParsingOptions {
    allowPreamble?: boolean,
    allowPostamble?: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class TextParsingService {

    constructor(private tokeniser: TokeniserService) {}

    public *parser(data: ParseData, options: TextParsingOptions) {

        const _options: TextParsingOptions = {
            allowPreamble: options && options.allowPreamble,
            allowPostamble: options && options.allowPostamble,
        }

        let context = new ParseContext();
        let tokens: TokenList = this.tokeniser.parse(data.rawData);

        let tokeniser = tokens.getIterator();
        let item = tokeniser.next();

        while(!item.done) {
            context.setGroup(item.value);

            try {
                switch (context.tokenGroup.current.type) {
                    case parseTokenTypes.StartMarker:
                        //ignore this
                        break;
                    case parseTokenTypes.AcrossMarker:
                        this.onAcrossMarker(context, _options);
                        break;
                    case parseTokenTypes.DownMarker:
                        this.onDownMarker(context, _options);
                        break;
                    case parseTokenTypes.EndMarker:
                        this.onEndMarker(context, _options);
                        break;
                    case parseTokenTypes.Clue:
                        this.onClueToken(context, _options);
                        break;
                    case parseTokenTypes.ClueStart:
                        this.onClueStartToken(context, _options);
                        break;
                    case parseTokenTypes.Text:
                        this.onTextToken(context, _options);
                        break;
                    case parseTokenTypes.ClueEnd:
                        this.onClueEndToken(context, _options);
                        break;
                    default:
                }

                yield context as IParseContext;
                item = tokeniser.next();
                context.setGroup(item.value);

            } catch(error) {
                context.done = true;
                context.error = error;
                return context;
            }
        }

        context.done = true;
        context.setGroup(null);

        return context as IParseContext;
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
                if (context.buffer === null) {
                    context.direction = "down";
                } else {
                    throw new TextParsingError(token.lineNumber, token.text, "Found DOWN marker when expecting end of a clue", hints.missingLetterCount);
                }
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

    private onEndMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as EndMarkerToken;

        switch (context.direction) {
            case null:
                throw new TextParsingError(token.lineNumber, token.text, "reached end of file and no clues found");
                break;

            case "across":
                case null:
                    throw new TextParsingError(token.lineNumber, token.text, "reached end of file and no down clues found");
                    break;
    
            case "down":
                if (context.buffer !== null) {
                    throw new TextParsingError(token.lineNumber, token.text, "reached the end of the file with an unfinished clue.", hints.missingLetterCount);
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
                    throw new TextParsingError(token.lineNumber, token.text, "Found some text before the ACROSS or DOWN markers.");
                }
                break;

            case "across":
                if (context.hasContent) {
                    context.addText(token.text);
                } else {
                    throw new TextParsingError(token.lineNumber, token.text, "Expected the start of a new clue but found unrecognised text.");
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
