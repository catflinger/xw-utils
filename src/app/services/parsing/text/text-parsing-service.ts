import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { parseTokenTypes, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, EndMarkerToken } from './tokeniser/tokens';
import { IParseContext, ParseContext, TextParsingError } from './text-parsing-context';
import { Grid } from 'src/app/model/grid';
import { ClueBuffer } from './clue-buffer';
import { ClueGroup } from 'src/app/model/interfaces';

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
                        this.onClueToken(context, _options, data.grid);
                        break;
                    case parseTokenTypes.ClueStart:
                        this.onClueStartToken(context, _options, data.grid);
                        break;
                    case parseTokenTypes.Text:
                        this.onTextToken(context, _options);
                        break;
                    case parseTokenTypes.ClueEnd:
                        this.onClueEndToken(context, _options);
                        break;
                    default:
                        throw "unrecognised Token Type";
                }

                yield context as IParseContext;
                item = tokeniser.next();
                context.setGroup(item.value);

            } catch(error) {
                //context.state = true;
                if (error instanceof TextParsingError) {
                    context.error = error;
                } else {
                    throw error.toString();
                }
                
                return context;
            }
        }

        //context.state = true;
        context.setGroup(null);

        return context as IParseContext;
    }

    private onAcrossMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as AcrossMarkerToken;

        switch (context.state) {
            case null:
                context.state = "across";
                break;

            case "across":
                throw new TextParsingError("acrossMarker_across", token.lineNumber, token.text, "Found unexpected ACROSS marker");

            case "down":
                throw new TextParsingError("acrossMarker_down", token.lineNumber, token.text, "Found ACROSS marker in the down clues");

            case "ended":
                if (options.allowPostamble) {
                    // this is OK, it will happen when the solutions from last weeks puzzle appear at the end of a PDF
                } else {
                    throw new TextParsingError("acrossMarker_ended", token.lineNumber, token.text, "Found ACROSS marker after the end of the puzzle");
                }
                break;
        }
    }

    private onDownMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as DownMarkerToken;

        switch (context.state) {
            case "across":
                if (context.buffer === null) {
                    context.state = "down";
                } else {
                    throw new TextParsingError("downMarker_across", token.lineNumber, token.text, "Found DOWN marker when expecting end of a clue");
                }
                break;

            case null:
                // even in preamble mode this is probably an error.  Answers to last weeks clues normally appear at the end of a puzzle
                throw new TextParsingError("downMarker_null", token.lineNumber, token.text, "Found unexpected DOWN marker");

            case "down":
                // even in preamble mode this is probably an error.  Answers to last weeks clues don't normally start with a down marker
                throw new TextParsingError("downMarker_down", token.lineNumber, token.text, "Found DOWN marker in the down clues");

            case "ended":
                if (options.allowPostamble) {
                    // this is probably OK, down markers can appear in solutions to last week's puzzle
                } else {
                    throw new TextParsingError("downMarker_ended", token.lineNumber, token.text, "Found DOWN marker after the end of the puzzle");
                }
                break;
        }
    }

    private onEndMarker(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as EndMarkerToken;

        switch (context.state) {
            case null:
                throw new TextParsingError("endMarker_null", token.lineNumber, token.text, "reached end of file and no clues found");

            case "across":
                case null:
                    throw new TextParsingError("endMarker_across", token.lineNumber, token.text, "reached end of file and no down clues found");
    
            case "down":
                if (context.buffer === null) {
                    // this is good news, the input ends following a completed down clue
                } else {
                    throw new TextParsingError("endMarker_down", token.lineNumber, token.text, "reached the end of the file with an unfinished clue.");
                }
                break;
        }
    }

    private onClueToken(context: ParseContext, options: TextParsingOptions, grid: Grid) {
        const token = context.tokenGroup.current as ClueToken;

        switch (context.state) {
            case null:
                // even in preamble mode this is probably an error, we don't expect to see a well formatted clue before the first across marker
                throw new TextParsingError("clue_null", token.lineNumber, token.text, "Found start of clue before ACROSS or DOWN marker");
                break;

            case "ended":
                // we don't expect to se whole clues cropping up in the solutions
                throw new TextParsingError("clue_ended", token.lineNumber, token.text, "Found clue after and of down clues");

            case "across":
            case "down":
                if (!context.hasContent) {
                    context.addClueText(token.text);
                    context.save();
                } else {
                    this.handleUnexpectedClue(token, context, grid);
                }
                break;
            }
    }

    private onClueStartToken(context: ParseContext, options: TextParsingOptions, grid: Grid) {
        const token = context.tokenGroup.current as ClueStartToken;

        switch (context.state) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError("clueStart_null", token.lineNumber, token.text, "Found start of clue before ACROSS or DOWN marker");
                }
                break;

            case "across":
            case "down":
                if (!context.hasContent) {
                    context.addClueText(token.text);
                } else {
                    this.handleUnexpectedClue(token, context, grid);
                }
                break;

            case "ended": 
            if (options.allowPostamble) {
                // This situation is ambiguous.  Probably indicates something htat caused the down clues to end early
                // but we can't be sure at this stage
                context.addWarning(context.tokenGroup.current.lineNumber, "Found another clue after the end of the puzzle.");
            } else {
                throw new TextParsingError("clueStart_ended", token.lineNumber, token.text, "Found clue start after end of down clues");
            }
            break;
        }
    }

    private onClueEndToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as ClueEndToken;

        switch (context.state) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError("clueEnd_null", token.lineNumber, token.text, "Found end of clue before ACROSS or DOWN marker");
                }
                break;

            case "across":
            case "down":
                if (context.hasContent) {
                    context.addClueText(token.text);
                    context.save();
                } else {

                // TO DO: ask the user to fix this manually

                // 1.  

                    throw new TextParsingError("clueStart_acrossdown", token.lineNumber, token.text, "Found end of clue when no clue started");
                }
                break;

            case "ended":
                if (options.allowPostamble) {
                    // This situation is ambiguous.  Probably indicates something htat caused the down clues to end early
                    // but we can't be sure at this stage
                    context.addWarning(context.tokenGroup.current.lineNumber, "Found a clue after the end of the puzzle.");
                } else {
                        throw new TextParsingError("clueEnd_ended", token.lineNumber, token.text, "Found clue end after end of down clues");
                }
                break;
        }
    }
    
    private onTextToken(context: ParseContext, options: TextParsingOptions) {
        const token = context.tokenGroup.current as TextToken;

        switch (context.state) {
            case null:
                if (!options.allowPreamble) {
                    throw new TextParsingError("text_null", token.lineNumber, token.text, "Found some text before the ACROSS or DOWN markers.");
                }
                break;

            case "across":
                if (context.hasContent) {
                    context.addClueText(token.text);
                } else {
                    throw new TextParsingError("text_across", token.lineNumber, token.text, "Expected the start of a new clue but found unrecognised text.");
                }
                break;

            case "down":
                if (context.hasContent) {
                    context.addClueText(token.text);
                } else {
                    if (options.allowPostamble) {
                        // in postamble mode the down clues are over when a completed down clue is followed by
                        // something not recognisable as part of another clue
                        context.state = "ended";
                    } else {
                        throw new TextParsingError("text_down", token.lineNumber, token.text, "Expected the start of a new clue");
                    }
                }
                break;
        }
    }

    private handleUnexpectedClue(token: TextToken, context: ParseContext, grid: Grid) {
        if (grid) {

            // This situation can arise when a clue has the letter count missing.

            // TO DO: we need to consider the case where one of the clues involved has more than one entry in the caption.
            // This will change what the expected next clue number will be.  Probably won't happen very often but should 
            // still try and cover this case anyway.  Will need some careful thinking to get this right.  At the moment
            // best to not attempt it at all than to code a botched attempt that causes more harm than good.

            let expectedNextClueNumber: number = grid.getNextClueNumber(context.buffer.gridRefs[0]);
            let nextClueBuf = new ClueBuffer(token.text, context.state as ClueGroup);

            let actualNextClueNumber = nextClueBuf.gridRefs[0].clueNumber;

            if (expectedNextClueNumber === actualNextClueNumber) {
                // create a new letter count
                let letterCount = " (";
                context.buffer.gridRefs.forEach((ref, index) => {
                    let entry = grid.getGridEntryForCaption(ref.clueNumber.toString(), ref.clueGroup);
                    if (index > 0) {
                        letterCount += ", ";
                    }
                    letterCount += entry.length.toString();
                });
                letterCount += ")";
                
                // finish off the existing clue with an added lettercount
                context.addClueText(letterCount);
                context.save();
                
                //start the new clue
                context.addClueText(token.text);
            } else {
                // assume this is OK, not a clue number we were expecting, just a clue that happens to contain a number in the middle
                // of the text that by chance has word-wrapped to the start of a new line
                
                if (token.type === parseTokenTypes.Clue) {
                    // looks like a clue token but is actually a clue end.  Treat as such.
                    context.addClueText(token.text);
                    context.save();
                } else {
                    // looks like a clue start token, is actually just plain text.  Treat as such.
                    context.addClueText(token.text);
                }
            }
        } else {
            throw new TextParsingError("clueStart_acrossdown", token.lineNumber, token.text, "Found start of new clue when old clue not finished (3)");
        }
    }
}
