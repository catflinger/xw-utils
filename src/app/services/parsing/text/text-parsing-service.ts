import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { ParseData } from "./parse-data";
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, EndMarkerToken } from './tokeniser/tokens';
import { IParseContext, ParseContext } from './text-parsing-context';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { ClueBuffer } from './clue-buffer';
import { ClueGroup } from 'src/app/model/interfaces';
import { TextParsingError } from 'src/app/model/puzzle-model/text-parsing-error';
import { TextParsingOptions } from './types';
import { Clue } from 'src/app/model/puzzle-model/clue';

@Injectable({
    providedIn: 'root'
})
export class TextParsingService {

    constructor(
        private tokeniser: TokeniserService,
        ) {}

    public *parser(data: ParseData, textParsingOptions: TextParsingOptions) {

        const _options: TextParsingOptions = textParsingOptions ?
         {
            allowPreamble: textParsingOptions.allowPreamble,
            allowPostamble: textParsingOptions.allowPostamble,
            allowTypos: textParsingOptions.allowTypos,
            azedFeatures: textParsingOptions.azedFeatures,
            captionStyle: textParsingOptions.captionStyle,
            hasLetterCount: textParsingOptions.hasLetterCount,
            hasClueGroupHeadings: textParsingOptions.hasClueGroupHeadings,
        } :
        {
            allowPreamble: false,
            allowPostamble: false,
            allowTypos: false,
            azedFeatures: false,
            captionStyle: "numbered",
            hasLetterCount: true,
            hasClueGroupHeadings: true,
        }

        let context = new ParseContext(_options);
        let tokens: TokenList = this.tokeniser.parse(data.rawData, _options);

        let tokeniser = tokens.getIterator();
        let item = tokeniser.next();

        while(!item.done) {

            // TO DO: have a parse trace setting to display progress in the parse orcess
            // console.log(`State is ${context.state} parsing token ${JSON.stringify(item.value.current.type)}`)

            context.setGroup(item.value);

            try {
                switch (context.tokenGroup.current.type) {
                    case "StartMarkerToken":
                        break;
                    case "AcrossMarkerToken":
                        this.onAcrossMarker(context);
                        break;
                    case "DownMarkerToken":
                        this.onDownMarker(context);
                        break;
                    case "EndMarkerToken":
                        this.onEndMarker(context);
                        break;
                    case "ClueToken":
                        this.onClueToken(context, data.grid);
                        break;
                    case "ClueStartToken":
                        this.onClueStartToken(context, data.grid);
                        break;
                    case "TextToken":
                        this.onTextToken(context);
                        break;
                    case "ClueEndToken":
                        this.onClueEndToken(context);
                        break;
                    default:
                        throw "unrecognised Token Type";
                }

                yield context as IParseContext;
                item = tokeniser.next();
                context.setGroup(item.value);

            } catch(error) {
                if (error instanceof TextParsingError) {
                    context.error = error;
                } else {
                    throw error;
                }
                
                return context;
            }
        }

        //context.state = true;
        context.setGroup(null);

        return context as IParseContext;
    }

    private onAcrossMarker(context: ParseContext) {

        switch (context.state) {
            case null:
                context.state = "across";
                break;

            case "across":
                throw new TextParsingError({
                    code: "acrossMarker_across",
                    tokens: context.tokenGroup,
                    message: "Found unexpected ACROSS marker"});

            case "down":
                throw new TextParsingError({
                    code: "acrossMarker_down", 
                    tokens: context.tokenGroup, 
                    message: "Found ACROSS marker in the down clues"});

            case "ended":
                if (context.textParsingOptions.allowPostamble) {
                    // this is OK, it will happen when the solutions from last weeks puzzle appear at the end of a PDF
                } else {
                    throw new TextParsingError({
                        code: "acrossMarker_ended", 
                        tokens: context.tokenGroup, 
                        message: "Found ACROSS marker after the end of the puzzle"});
                }
                break;
        }
    }

    private onDownMarker(context: ParseContext) {

        switch (context.state) {
            case "across":
                if (context.buffer === null) {
                    context.state = "down";
                } else {
                    throw new TextParsingError({
                        code: "downMarker_across", 
                        tokens: context.tokenGroup, 
                        message: "Found DOWN marker when expecting end of a clue"});
                }
                break;

            case null:
                // even in preamble mode this is probably an error.  Answers to last weeks clues normally appear at the end of a puzzle
                throw new TextParsingError({
                    code: "downMarker_null", 
                    tokens: context.tokenGroup, 
                    message: "Found unexpected DOWN marker"});

            case "down":
                // even in preamble mode this is probably an error.  Answers to last weeks clues don't normally start with a down marker
                throw new TextParsingError({
                    code: "downMarker_down",
                    tokens: context.tokenGroup,
                    message: "Found DOWN marker in the down clues"});

            case "ended":
                if (context.textParsingOptions.allowPostamble) {
                    // this is probably OK, down markers can appear in solutions to last week's puzzle
                } else {
                    throw new TextParsingError({
                        code: "downMarker_ended", 
                        tokens: context.tokenGroup,
                        message: "Found DOWN marker after the end of the puzzle"});
                }
                break;
        }
    }

    private onEndMarker(context: ParseContext) {

        switch (context.state) {
            case null:
                throw new TextParsingError({
                    code: "endMarker_null",
                    tokens: context.tokenGroup,
                    message: "reached end of file and no clues found"});

            case "across":
                if (context.textParsingOptions.hasClueGroupHeadings) {
                    throw new TextParsingError({
                        code: "endMarker_across",
                        tokens: context.tokenGroup,
                        message: "reached end of file and no down clues found"});
                } else if (context.buffer === null) {
                    // this is good news, the input ends following a completed clue
                } else {
                    throw new TextParsingError({
                        code: "endMarker_down",
                        tokens: context.tokenGroup,
                        message: "reached the end of the file with an unfinished clue."});
                }
                break;
    
            case "down":
                if (context.buffer === null) {
                    // this is good news, the input ends following a completed down clue
                } else {
                    throw new TextParsingError({
                        code: "endMarker_down",
                        tokens: context.tokenGroup,
                        message: "reached the end of the file with an unfinished clue."});
                }
                break;
        }
    }

    private onClueToken(context: ParseContext, grid: Grid) {
        const token = context.tokenGroup.current as ClueToken;

        switch (context.state) {
            case null:
                if (context.textParsingOptions.hasClueGroupHeadings === false) {
                    context.state = "across";
                    context.addClueText(token.text);
                    context.save();
                } else {
                    // even in preamble mode this is probably an error, we don't expect to see a well formatted clue before the first across marker
                    throw new TextParsingError({
                        code: "clue_null",
                        tokens: context.tokenGroup,
                        message: "Found start of clue before ACROSS or DOWN marker"});
                }
                break;
                
            case "ended":
                // we don't expect to se whole clues cropping up in the solutions
                throw new TextParsingError({
                    code: "clue_ended",
                    tokens: context.tokenGroup,
                    message: "Found clue after and of down clues"});

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

    private onClueStartToken(context: ParseContext, grid: Grid) {
        const token = context.tokenGroup.current as ClueStartToken;

        switch (context.state) {
            case null:
                if (context.textParsingOptions.allowPreamble) {
                    context.addPreamble(token.text);
                } else {
                    throw new TextParsingError({
                        code: "clueStart_null",
                        tokens: context.tokenGroup,
                        message: "Found start of clue before ACROSS or DOWN marker"});
                }
                break;

            case "across":
            case "down":
                if (!context.hasContent) {
                    context.addClueText(token.text);
                    if (Clue.isRedirect(context.buffer.clue)) {
                        context.save();
                    }
                } else {
                    this.handleUnexpectedClue(token, context, grid);
                }
                break;

            case "ended": 
            if (context.textParsingOptions.allowPostamble) {
                // This situation is ambiguous.  Probably indicates something htat caused the down clues to end early
                // but we can't be sure at this stage
                context.addWarning(context.tokenGroup.current.lineNumber, "Found another clue after the end of the puzzle.");
            } else {
                throw new TextParsingError({
                    code: "clueStart_ended",
                    tokens: context.tokenGroup,
                    message: "Found clue start after end of down clues"});
            }
            break;
        }
    }

    private onClueEndToken(context: ParseContext) {
        const token = context.tokenGroup.current as ClueEndToken;

        switch (context.state) {
            case null:
                if (context.textParsingOptions.allowPreamble) {
                    context.addPreamble(token.text);
                } else {
                    throw new TextParsingError({
                        code: "clueEnd_null",
                        tokens: context.tokenGroup,
                        message: "Found end of clue before ACROSS or DOWN marker"});
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

                    throw new TextParsingError({
                        code: "clueEnd_acrossdown",
                        tokens: context.tokenGroup,
                        message: "Found end of clue when no clue started"});
                }
                break;

            case "ended":
                if (context.textParsingOptions.allowPostamble) {
                    // This situation is ambiguous.  Probably indicates something htat caused the down clues to end early
                    // but we can't be sure at this stage
                    context.addWarning(context.tokenGroup.current.lineNumber, "Found a clue after the end of the puzzle.");
                } else {
                        throw new TextParsingError({
                            code: "clueEnd_ended",
                            text: token.text,
                            tokens: context.tokenGroup,
                            message: "Found clue end after end of down clues"});
                }
                break;
        }
    }
    
    private onTextToken(context: ParseContext) {
        const token = context.tokenGroup.current as TextToken;
        const azedExp = /^\s*(name|address|post\s*code)\s*$/i;

        switch (context.state) {
            case null:
                if (context.textParsingOptions.allowPreamble) {
                    context.addPreamble(token.text);
                } else {
                    throw new TextParsingError({
                        code: "text_null",
                        tokens: context.tokenGroup,
                        message: "Found some text before the ACROSS or DOWN markers."});
                }
                break;

            case "across":

                if (context.hasContent) {
                    context.addClueText(token.text);

                } else if (context.textParsingOptions.azedFeatures && azedExp.test(token.text)) {
                    // extracts from AZED pdfs somethimes mistakenly include address details in the across clues
                    // ignore these lines
                    
                } else {
                    throw new TextParsingError({
                        code: "text_across",
                        tokens: context.tokenGroup,
                        message: "Expected the start of a new clue but found unrecognised text: [" + token.text + "]"});
                }
                break;

            case "down":
                if (context.hasContent) {
                    context.addClueText(token.text);

                } else if (context.textParsingOptions.azedFeatures && azedExp.test(token.text)) {
                    // extracts from AZED pdfs somethimes mistakenly include address details in the across clues
                    // ignore these lines
                    
                } else {
                    if (context.textParsingOptions.allowPostamble) {
                        // in postamble mode the down clues are over when a completed down clue is followed by
                        // something not recognisable as part of another clue
                        context.state = "ended";
                    } else {
                        throw new TextParsingError({
                            code: "text_down",
                            tokens: context.tokenGroup,
                            message: "Expected the start of a new clue"});
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
            let nextClueBuf = new ClueBuffer(context.textParsingOptions.captionStyle, token.text, context.state as ClueGroup);

            let actualNextClueNumber: number = nextClueBuf.gridRefs[0].anchor;

            if (expectedNextClueNumber === actualNextClueNumber) {
                // create a new letter count
                let letterCount = " (";
                context.buffer.gridRefs.forEach((ref, index) => {
                    let entry = grid.getGridEntryFromReference(ref);
                    if (index > 0) {
                        letterCount += ", ";
                    }
                    letterCount += entry.length.toString();
                });
                letterCount += ")";
                
                // finish off the existing clue with an added lettercount
                context.addClueText(letterCount);
                context.addWarning(token.lineNumber, `A clue was found that looks to be missing a letter count, a new lettercount has been added.`);
                context.save();

            } else {
                // assume this is OK, not a clue number we were expecting, just a clue that happens to contain a number in the middle
                // of the text that by chance has word-wrapped to the start of a new line
            }
            
            if (token.type === "ClueToken") {
                context.addClueText(token.text);
                context.save();
            } else {
                context.addClueText(token.text);
            }
        } else {
            throw new TextParsingError({
                code: "clueStart_acrossdown",
                tokens: context.tokenGroup,
                message: "Found start of new clue when old clue not finished (3)"});
        }
    }
}
