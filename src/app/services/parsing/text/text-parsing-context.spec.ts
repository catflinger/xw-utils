import { ParseContext } from './text-parsing-context';

let parseContext: ParseContext = new ParseContext();
let parts: any;

describe('TextParsingContext', () => {
    describe('Anwser Formats', () => {
        it('should  constrcut a simple format', () => {
            let letterCount = parseContext["makeAnswerFormat"]("(4)");
            expect(letterCount).toEqual(",,,,");
        });
        it('should  constrcut a hyphenated format', () => {
            let letterCount = parseContext["makeAnswerFormat"]("(4-3)");
            expect(letterCount).toEqual(",,,,-,,,");
        });
        it('should  constrcut a multi-word format', () => {
            let letterCount = parseContext["makeAnswerFormat"]("(2, 3)");
            expect(letterCount).toEqual(",,/,,,");
        });
        it('should  constrcut a complex format', () => {
            let letterCount = parseContext["makeAnswerFormat"]("(2-3, 1,1,3 )");
            expect(letterCount).toEqual(",,-,,,/,/,/,,,");
        });
        it('should  constrcut ignore AZED style lettercounts', () => {
            let letterCount = parseContext["makeAnswerFormat"]("(5, 2 words)");
            expect(letterCount).toEqual(",,,,,");
        });
    });
});
