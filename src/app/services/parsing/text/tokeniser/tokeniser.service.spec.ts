import { TestBed } from '@angular/core/testing';
import { TokeniserService, TokenList } from './tokeniser.service';
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
        let tokens = service.parse(testData.simple).tokens;

        expect(tokens.length).toEqual(5);
        expect(tokens[0].type).toEqual(parseTokenTypes.AcrossMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.DownMarkerToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueToken);
    });

    it('should parse with preamble', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.simpleWithPreamble).tokens;

        expect(tokens.length).toEqual(9);
        expect(tokens[2].type).toEqual(parseTokenTypes.AcrossMarkerToken);
        expect(tokens[4].type).toEqual(parseTokenTypes.DownMarkerToken);
        expect(tokens[5].type).toEqual(parseTokenTypes.ClueToken);
    });

    it('should parse split text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.splitLines).tokens;

        expect(tokens.length).toEqual(10);
        expect(tokens[0].type).toEqual(parseTokenTypes.AcrossMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueEndToken);
        expect(tokens[6].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[7].type).toEqual(parseTokenTypes.TextToken);
        expect(tokens[8].type).toEqual(parseTokenTypes.ClueEndToken);
    });

    it('should skip blank lines', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.splitLinesWithBlanks).tokens;

        expect(tokens.length).toEqual(10);
        expect(tokens[0].type).toEqual(parseTokenTypes.AcrossMarkerToken);
        expect(tokens[1].type).toEqual(parseTokenTypes.ClueToken);
        expect(tokens[2].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueEndToken);
        expect(tokens[6].type).toEqual(parseTokenTypes.ClueStartToken);
        expect(tokens[7].type).toEqual(parseTokenTypes.TextToken);
        expect(tokens[8].type).toEqual(parseTokenTypes.ClueEndToken);
    });

});

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
