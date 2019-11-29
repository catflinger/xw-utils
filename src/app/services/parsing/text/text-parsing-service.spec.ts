import { TestBed } from '@angular/core/testing';
import { TextParsingService } from './text-parsing-service';
import { ParseToken, GroupMarkerToken, ClueToken, ClueStartToken, ClueEndToken, TextToken } from './tokeniser/tokens';
import { Line } from './line';
import { ParseData } from './parse-data';
import { MockTokeniserService } from './tokeniser/mock-tokeniser.service';
import { TokeniserService } from "./tokeniser/tokeniser.service";

describe('TextParsingService', () => {
    let mockTokeniser: MockTokeniserService = new MockTokeniserService();
    //let tokeniser: TokeniserService = new MockTokeniserService();

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: TextParsingService = new TextParsingService(mockTokeniser);
        expect(service).toBeTruthy();
    });

    it('should parse simple text', () => {
        mockTokeniser.setTestData(testData.simple);
        //const service: TextParsingService = TestBed.get(TextParsingService);
        const service: TextParsingService = new TextParsingService(mockTokeniser);
        let result = service.parse(new ParseData());

        expect(result.clues.length).toEqual(4);
    });

    it('should parse split text', () => {
        mockTokeniser.setTestData(testData.split);
        //const service: TextParsingService = TestBed.get(TextParsingService);
        const service: TextParsingService = new TextParsingService(mockTokeniser);
        let result = service.parse(new ParseData());

        expect(result.clues.length).toEqual(2);
        expect(result.clues[0].text).toEqual("AB");
        expect(result.clues[1].text).toEqual("CDE");
    });

});

function logTokens(tokens: ParseToken[]) {
    tokens.forEach((token: ParseToken) => {
        console.log(`${token.toString()}`);
    });
}

const testData = {
    simple: [
        new GroupMarkerToken(new Line("ACROSS", 0), "across"),
        new ClueToken(new Line("A", 1)),
        new ClueToken(new Line("B", 2)),
        new GroupMarkerToken(new Line("DOWN", 3), "down"),
        new ClueToken(new Line("C", 4)),
        new ClueToken(new Line("D", 5)),
    ],
    split: [
        new GroupMarkerToken(new Line("ACROSS", 0), "across"),
        new ClueStartToken(new Line("A", 1)),
        new ClueEndToken(new Line("B", 2)),
        new GroupMarkerToken(new Line("DOWN", 3), "down"),
        new ClueStartToken(new Line("C", 4)),
        new TextToken(new Line("D", 4)),
        new ClueEndToken(new Line("E", 5)),
    ] 
 
}


