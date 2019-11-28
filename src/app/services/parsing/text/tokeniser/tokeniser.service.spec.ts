import { TestBed } from '@angular/core/testing';

import { TokeniserService } from './tokeniser.service';
import { Line } from '../line';
import { not } from '@angular/compiler/src/output/output_ast';
import { ParseToken } from './tokens';

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

        // fill the lines array fron the source data
        let lines = [];
        simpleData.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));

        let tokens = service.parse(lines);
        expect(tokens.length).toEqual(6);
    });

    it('should handle bad text', () => {
        const service: TokeniserService = TestBed.get(TokeniserService);

        // fill the lines array fron the source data
        let lines = [];
        badData.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));
        let tokens = service.parse(lines); 
        // tokens.forEach((token: ParseToken) => {
        //     console.log(`${token.toString()}`);
        // });
        expect(tokens.length).toEqual(4);
    });

});

const simpleData = `
ACROSS
1 A clue (4)
DOWN
2 A clue (6)
3 A clue (6)
4 A clue (6)
`;

const badData = `
ACROSS
1 A clue (4)
DOWN
DOWN
2 A clue (6)
2 A clue (6)
2 A clue (6)
`;
