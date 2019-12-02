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

        expect(tokens.length).toEqual(7);
        expect(tokens[0].type).toEqual(parseTokenTypes.StartMarker);
        expect(tokens[1].type).toEqual(parseTokenTypes.AcrossMarker);
        expect(tokens[2].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[3].type).toEqual(parseTokenTypes.DownMarker);
        expect(tokens[4].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[5].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[6].type).toEqual(parseTokenTypes.EndMarker);
    });

    it('should parse with preamble', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.simpleWithPreamble).tokens;

        expect(tokens.length).toEqual(11);
        expect(tokens[0].type).toEqual(parseTokenTypes.StartMarker);
        expect(tokens[3].type).toEqual(parseTokenTypes.AcrossMarker);
        expect(tokens[5].type).toEqual(parseTokenTypes.DownMarker);
        expect(tokens[6].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[10].type).toEqual(parseTokenTypes.EndMarker);
    });

    it('should parse split text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.splitLines).tokens;

        expect(tokens.length).toEqual(12);

        expect(tokens[0].type).toEqual(parseTokenTypes.StartMarker);
        expect(tokens[1].type).toEqual(parseTokenTypes.AcrossMarker);
        expect(tokens[2].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueStart);
        expect(tokens[4].type).toEqual(parseTokenTypes.ClueEnd);
        expect(tokens[5].type).toEqual(parseTokenTypes.DownMarker);
        expect(tokens[6].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[7].type).toEqual(parseTokenTypes.ClueStart);
        expect(tokens[8].type).toEqual(parseTokenTypes.Text);
        expect(tokens[9].type).toEqual(parseTokenTypes.ClueEnd);
        expect(tokens[10].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[11].type).toEqual(parseTokenTypes.EndMarker);
    });

    it('should skip blank lines', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);
        let tokens = service.parse(testData.splitLinesWithBlanks).tokens;

        expect(tokens.length).toEqual(12);
        expect(tokens[1].type).toEqual(parseTokenTypes.AcrossMarker);
        expect(tokens[2].type).toEqual(parseTokenTypes.Clue);
        expect(tokens[3].type).toEqual(parseTokenTypes.ClueStart);
        expect(tokens[4].type).toEqual(parseTokenTypes.ClueEnd);
        expect(tokens[7].type).toEqual(parseTokenTypes.ClueStart);
        expect(tokens[8].type).toEqual(parseTokenTypes.Text);
        expect(tokens[9].type).toEqual(parseTokenTypes.ClueEnd);
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
