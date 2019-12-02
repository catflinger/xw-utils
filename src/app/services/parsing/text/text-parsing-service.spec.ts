import { TestBed } from '@angular/core/testing';
import { TextParsingService } from './text-parsing-service';
import { ParseToken, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, StartMarkerToken, EndMarkerToken } from './tokeniser/tokens';
import { Line } from './line';
import { ParseData } from './parse-data';
import { MockTokeniserService } from './tokeniser/mock-tokeniser.service';
import { IParseContext } from './text-parsing-context';

let mockTokeniser: MockTokeniserService = new MockTokeniserService();

describe('TextParsingService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: TextParsingService = new TextParsingService(mockTokeniser);
        expect(service).toBeTruthy();
    });

    it('should parse simple text', () => {
        let result = runParser(testData.simple);
        expect(result.clues.length).toEqual(4);
    });

    it('should parse split text', () => {
        let result = runParser(testData.split);

        expect(result.clues.length).toEqual(2);
        expect(result.clues[0].text).toEqual("AB");
        expect(result.clues[1].text).toEqual("CDE");
    });

});

function runParser(data: ParseToken[]) {
    mockTokeniser.setTestData(data);
    const service: TextParsingService = new TextParsingService(mockTokeniser);

    let parser = service.parser(new ParseData(), null);
    let context = parser.next();

    while(!context.done) {
        context = parser.next();
    }

    return context.value as IParseContext;
}

const testData = {
    simple: [
        new StartMarkerToken(),
        new AcrossMarkerToken(new Line("ACROSS", 0)),
        new ClueToken(new Line("A", 1)),
        new ClueToken(new Line("B", 2)),
        new DownMarkerToken(new Line("DOWN", 3)),
        new ClueToken(new Line("C", 4)),
        new ClueToken(new Line("D", 5)),
        new EndMarkerToken(),
    ],
    split: [
        new StartMarkerToken(),
        new AcrossMarkerToken(new Line("ACROSS", 0)),
        new ClueStartToken(new Line("A", 1)),
        new ClueEndToken(new Line("B", 2)),
        new DownMarkerToken(new Line("DOWN", 3)),
        new ClueStartToken(new Line("C", 4)),
        new TextToken(new Line("D", 4)),
        new ClueEndToken(new Line("E", 5)),
        new EndMarkerToken(),
    ],
}
