import { TestBed } from '@angular/core/testing';
import { TextParsingService } from './text-parsing-service';
import { ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, StartMarkerToken, EndMarkerToken } from './tokeniser/tokens';
import { Line } from './line';
import { ParseData } from './parse-data';
import { MockTokeniserService } from './tokeniser/mock-tokeniser.service';
import { IParseContext } from './text-parsing-context';
import { IParseToken } from 'src/app/model/interfaces';

let mockTokeniser: MockTokeniserService = new MockTokeniserService(null);

describe('TextParsingService', () => {
    
    describe('Basic Parsing', () => {

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
            expect(result.clues[0].caption).toEqual("1");
            expect(result.clues[0].text).toEqual("A (4)");

            expect(result.clues[1].caption).toEqual("2");
            expect(result.clues[1].text).toEqual("B (4)");

            expect(result.clues[2].caption).toEqual("3");
            expect(result.clues[2].text).toEqual("C (4)");

            expect(result.clues[3].caption).toEqual("4");
            expect(result.clues[3].text).toEqual("D (4)");
        });

        it('should parse split text', () => {
            let result = runParser(testData.split);

            expect(result.clues.length).toEqual(2);
            
            expect(result.clues[0].caption).toEqual("1");
            expect(result.clues[0].text).toEqual("A B (4)");
            
            expect(result.clues[1].caption).toEqual("2");
            expect(result.clues[1].text).toEqual("C D E (4)");
        });
    });
});

function runParser(data: IParseToken[]) {
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
        new ClueToken(new Line("1 A (4)", 1)),
        new ClueToken(new Line("2 B (4)", 2)),
        new DownMarkerToken(new Line("DOWN", 3)),
        new ClueToken(new Line("3 C (4)", 4)),
        new ClueToken(new Line("4 D (4)", 5)),
        new EndMarkerToken(),
    ],
    split: [
        new StartMarkerToken(),
        new AcrossMarkerToken(new Line("ACROSS", 0)),
        new ClueStartToken(new Line("1 A", 1)),
        new ClueEndToken(new Line("B (4)", 2)),
        new DownMarkerToken(new Line("DOWN", 3)),
        new ClueStartToken(new Line("2 C ", 4)),
        new TextToken(new Line("D ", 4)),
        new ClueEndToken(new Line("E (4)", 5)),
        new EndMarkerToken(),
    ],
}
