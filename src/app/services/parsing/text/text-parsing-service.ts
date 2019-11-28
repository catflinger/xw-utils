import { ParseData } from "./parse-data";
import { ParseResult } from './parse-result';
import { Injectable } from '@angular/core';
import { Line } from './line';
import { ParseToken, GroupMarkerToken, SyntaxErrorToken, ClueToken, ClueEndToken, TextToken, ClueStartToken } from './tokeniser/tokens';
import { Clue } from '../../../model/clue';
import { TokeniserService } from './tokeniser/tokeniser.service';

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
            let tokens = this.tokeniser.parse(lines);

            // connsolidate the tokens by combining starts, middles and ends into single ClueTokens
            //let consolidatedTokens = this.consolidateTokens(tokens);

            // now create the clues for the puzzle
            //let clues: Clue[] = this.makeClues(consolidatedTokens);


        return new ParseResult();
    }

    private makeClues(tokens: ReadonlyArray<ParseToken>): Clue[] {
        return [];
    }

    private consolidateTokens(tokens: ReadonlyArray<ParseToken>): ParseToken[] {
        return [];
    }


}