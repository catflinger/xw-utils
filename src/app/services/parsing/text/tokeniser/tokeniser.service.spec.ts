import { TestBed } from '@angular/core/testing';

import { TokeniserService, TokeniserOptions } from './tokeniser.service';
import { Line } from '../line';
import { not } from '@angular/compiler/src/output/output_ast';
import { ParseToken, parseTokenTypes } from './tokens';

describe('TokeniserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        expect(service).toBeTruthy();
    });

    it('should parse simple text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.simple);

        expect(tokens.length).toEqual(5);
        expect(tokens[0].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueToken);
    });

    it('should parse with preamble option set', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.simpleWithPreamble, { allowPreamble: true, allowPostamble: true });

        expect(tokens.length).toEqual(5);
        expect(tokens[0].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[4].type).toEqual(parseTokenTypes.ClueToken);
    });

    it('should reject preamble if option not set', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.simpleWithPreamble, { allowPreamble: false, allowPostamble: true });

        expect(tokens.length).toEqual(1);
        expect(tokens[0].type).toEqual(parseTokenTypes.SyntaxErrorToken);
    });

    it('should reject postable if option not set', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.simpleWithPreamble, { allowPreamble: true, allowPostamble: false });

        expect(tokens.length).toEqual(6);
        expect(tokens[5].type).toEqual(parseTokenTypes.SyntaxErrorToken);
    });

    it('should handle bad text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.bad_RepeatedDowns);

        expect(tokens.length).toEqual(4);
    });

    it('should parse split text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.splitLines);

        expect(tokens.length).toEqual(10);
        expect(tokens[0].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueEndToken);
        expect(tokens[6].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[7].type).toEqual(parseTokenTypes.TextToken);
        expect(tokens[8].type).toEqual(parseTokenTypes.ClueEndToken);
    });

    it('should skip blank lines', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = getTestResult(service, testData.splitLinesWithBlanks);

        expect(tokens.length).toEqual(10);
        expect(tokens[0].type).toEqual(parseTokenTypes.GroupMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueEndToken);
        expect(tokens[6].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[7].type).toEqual(parseTokenTypes.TextToken);
        expect(tokens[8].type).toEqual(parseTokenTypes.ClueEndToken);
    });

});

function getTestResult(service, data, options?:TokeniserOptions): ParseToken[] {
    let lines = [];
    data.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));
    return service.parse(lines, options);
}
function logTokens(tokens: ParseToken[]) {
    tokens.forEach((token: ParseToken) => {
        console.log(`${token.toString()}`);
    });
}

const testData = {

simple: `
ACROSS
1 A clue (4)
DOWN
2 A clue (5)
3 A clue (6)
`,

simpleWithPreamble: `
blah blah blah
hooey hooey

ACROSS
1 A clue (4)
DOWN
2 A clue (5)
3 A clue (6)

all done, just ignore me
blahblah blah
`,

bad_RepeatedDowns: `
ACROSS
1 A clue (4)
DOWN
DOWN
2 A clue (6)
2 A clue (6)
`,

splitLines: `
ACROSS
1 A clue (4)
3 A clue start
  and the end (8)
DOWN
2 A clue (6)
3 A clue start
  and a middle
  and the end (8)
2 A clue (6)
`,

splitLinesWithBlanks: `

ACROSS
1 A clue (4)
3 A clue start
  and the end (8)

DOWN
2 A clue (6)
3 A clue start
  and a middle

  and the end (8)
2 A clue (6)
`,


}
