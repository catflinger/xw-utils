import { Injectable } from '@angular/core';
import { ParseData } from "./parse-data";
import { ParseResult } from './parse-result';
import { ClueGroup } from "../../../model/interfaces";
import { Line } from './line';
import { Clue } from '../../../model/clue';
import { TokeniserService, TokenList } from './tokeniser/tokeniser.service';
import { Grid } from 'src/app/model/grid';
import { parseTokenTypes, GroupMarkerToken } from './tokeniser/tokens';

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
            let clues: Clue[] = this.compile(tokens, data.grid);

        let result = new ParseResult();
        result.clues = clues;

        return result;
    }

    private compile(tokens: TokenList, grid: Grid): Clue[] {
        let clues: Clue[] = [];
        let clueBuffer: string = null;
        let direction: ClueGroup =  null;

        let iterator = tokens.getIterator();
        let item = iterator.next();

        while(!item.done) {
            let current = item.value.current;

            switch (current.type) {

                case parseTokenTypes.GroupMarkerToken:
                    const marker = current as GroupMarkerToken;

                    if (direction === null && marker.groupMarker === "across") {
                        direction = "across";
                    } else if (direction === "across" && marker.groupMarker === "down") {
                        direction = "down";
                    } else {
                        // TO DO: handle this error
                    }
                    break;

                case parseTokenTypes.ClueToken:

                    if (clueBuffer === null) {
                        clues.push(new Clue({
                            group: direction,
                            entries: [],
                            chunks: [],
                            warnings: [],
                            text: current.text
                        }));
                    } else {
                        // get a new clue but old clue not finished
                        // TO DO: ...
                    }
                    break;

                case parseTokenTypes.ClueStartToken:

                    if (clueBuffer === null) {
                        clueBuffer = current.text;
                    } else {
                        // get a new clue but old clue not finished
                        // TO DO: ...
                    }
                    break;

                case parseTokenTypes.TextToken:

                    if (clueBuffer !== null) {
                        clueBuffer +=  current.text;
                    } else {
                        // got some general text when expecting to start a clue
                    }
                    break;
    
                case parseTokenTypes.ClueEndToken:

                    if (clueBuffer !== null) {
                        clueBuffer +=  current.text;

                        clues.push(new Clue({
                            group: direction,
                            entries: [],
                            chunks: [],
                            warnings: [],
                            text: clueBuffer,
                        }));

                        clueBuffer = null;

                    } else {
                        // get a clue ending not no clue has been started
                        // TO DO: ...
                    }
                    break;

                default:
            }
            item = iterator.next();
        }

        return clues;
    }
}
