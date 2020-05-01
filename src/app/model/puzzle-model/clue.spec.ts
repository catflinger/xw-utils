import { Clue } from './clue';


describe('Clue', () => {
    describe('Letter Counts', () => {
        it('should  parse a simple format', () => {
            let letterCount = Clue["getLetterCount"]("1 This is a clue (4)");
            expect(letterCount).toEqual("4");
        });
        it('should  parse a hyphenated format', () => {
            let letterCount = Clue["getLetterCount"]("This s 4, 5 clue (4-3)");
            expect(letterCount).toEqual("4-3");
        });
        it('should parse a multi-word format', () => {
            let letterCount = Clue["getLetterCount"]("(2, 3)");
            expect(letterCount).toEqual("2, 3");
        });
        it('should parse a complex format', () => {
            let letterCount = Clue["getLetterCount"]("2,4 This (3) is more (2-3, 1,1,3 )");
            expect(letterCount).toEqual("2-3, 1,1,3");
        });
        it('should parse AZED style lettercounts', () => {
            let letterCount = Clue["getLetterCount"]("2 words in this clue (5, 2 words)");
            expect(letterCount).toEqual("5, 2 words");
        });
    });

    describe('Anwser Formats', () => {
        it('should  constrcut a simple format', () => {
            let letterCount = Clue["getAnswerFormat"]("4");
            expect(letterCount).toEqual(",,,,");
        });
        it('should  constrcut a hyphenated format', () => {
            let letterCount = Clue["getAnswerFormat"]("4-3");
            expect(letterCount).toEqual(",,,,-,,,");
        });
        it('should  constrcut a multi-word format', () => {
            let letterCount = Clue["getAnswerFormat"]("2, 3");
            expect(letterCount).toEqual(",,/,,,");
        });
        it('should  constrcut a complex format', () => {
            let letterCount = Clue["getAnswerFormat"]("2-3, 1,1,3");
            expect(letterCount).toEqual(",,-,,,/,/,/,,,");
        });
        it('should  constrcut AZED style lettercounts', () => {
            let letterCount = Clue["getAnswerFormat"]("5, 2 words");
            expect(letterCount).toEqual(",,,,,");
        });
    });
});