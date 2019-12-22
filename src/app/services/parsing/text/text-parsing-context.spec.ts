import { ParseContext } from './text-parsing-context';

let parseContext: ParseContext = new ParseContext();
let parts: any;

describe('TextParsingContext', () => {
    describe('Captions', () => {
        it('should  extract a simple caption', () => {
            parts = parseContext["readCaption"]("1 This is clue 1 down (4)");
            expect(parts.caption).toEqual("1");
            expect(parts.clue).toEqual("This is clue 1 down (4)");

            parts = parseContext["readCaption"]("22 This is a clue 3 across (4)");
            expect(parts.caption).toEqual("22");
            expect(parts.clue).toEqual("This is a clue 3 across (4)");
        });

        it('should  extract a compound caption', () => {
            parts = parseContext["readCaption"]("1,3 This is a clue (4)");
            expect(parts.caption).toEqual("1,3");
            expect(parts.clue).toEqual("This is a clue (4)");

            parts = parseContext["readCaption"]("22, 2 This is a clue (4)");
            expect(parts.caption).toEqual("22, 2");
            expect(parts.clue).toEqual("This is a clue (4)");
        });

        it('should  handle direction makers', () => {
            parts = parseContext["readCaption"]("1,3down This is a clue (4)");
            expect(parts.caption).toEqual("1,3down");
            expect(parts.clue).toEqual("This is a clue (4)");

            parts = parseContext["readCaption"]("22, 2 across This is a clue (4)");
            expect(parts.caption).toEqual("22, 2 across");
            expect(parts.clue).toEqual("This is a clue (4)");
        });

        it('should handle number at strt of clue', () => {
            parts = parseContext["readCaption"]("1 2 is my favbourite number (4)");
            expect(parts.caption).toEqual("1");
            expect(parts.clue).toEqual("2 is my favbourite number (4)");

            parts = parseContext["readCaption"]("22, 2 Across across means to go over (4)");
            expect(parts.caption).toEqual("22, 2");
            expect(parts.clue).toEqual("Across across means to go over (4)");
        });
    });

    describe('Letter Counts', () => {
        it('should  extract a simple letter count', () => {
            let letterCount = parseContext["readLetterCount"]("1 This is clue 1 down (4)");
            expect(letterCount).toEqual("(4)");
        });
    });

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
