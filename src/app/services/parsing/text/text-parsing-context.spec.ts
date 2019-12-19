import { ParseContext } from './text-parsing-context';



describe('Captions', () => {
    it('should  extract a simple caption', () => {
        expect(ParseContext["readCaption"]("1 This is clue 1 down (4)")).toEqual("1");
        expect(ParseContext["readCaption"]("22 This is a clue 3 across (4)")).toEqual("22");
    });

    it('should  extract a compound caption', () => {
        expect(ParseContext["readCaption"]("1,3 This is a clue (4)")).toEqual("1,3");
        expect(ParseContext["readCaption"]("22, 2 This is a clue (4)")).toEqual("22, 2");
    });

    it('should  handle direction makers', () => {
        expect(ParseContext["readCaption"]("1,3down This is a clue (4)")).toEqual("1,3down");
        expect(ParseContext["readCaption"]("22, 2 across This is a clue (4)")).toEqual("22, 2 across");
    });
});
