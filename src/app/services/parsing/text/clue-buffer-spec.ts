import {} from "jasmine";
import { ClueBuffer } from "./clue-buffer";

let cb: ClueBuffer;
let parts: any;

describe('ClueBuffer', () => {
    describe('Captions', () => {
        it('should  extract a simple caption', () => {
            cb = new ClueBuffer("1 This is clue 1 down (4)", "across");
            expect(cb.caption).toEqual("1");
            expect(cb.clue).toEqual("This is clue 1 down (4)");

            cb = new ClueBuffer("22 This is a clue 3 across (4)", "across");
            expect(parts.caption).toEqual("22");
            expect(parts.clue).toEqual("This is a clue 3 across (4)");
        });

        it('should  extract a compound caption', () => {
            cb = new ClueBuffer("1,3 This is a clue (4)", "across");
            expect(parts.caption).toEqual("1,3");
            expect(parts.clue).toEqual("This is a clue (4)");

            cb = new ClueBuffer("22, 2 This is a clue (4)", "across");
            expect(parts.caption).toEqual("22, 2");
            expect(parts.clue).toEqual("This is a clue (4)");
        });

        it('should  handle direction makers', () => {
            cb = new ClueBuffer("1,3down This is a clue (4)", "across");
            expect(parts.caption).toEqual("1,3down");
            expect(parts.clue).toEqual("This is a clue (4)");

            cb = new ClueBuffer("22, 2 across This is a clue (4)", "across");
            expect(parts.caption).toEqual("22, 2 across");
            expect(parts.clue).toEqual("This is a clue (4)");
        });

        it('should handle number at strt of clue', () => {
            cb = new ClueBuffer("1 2 is my favbourite number (4)", "across");
            expect(parts.caption).toEqual("1");
            expect(parts.clue).toEqual("2 is my favbourite number (4)");

            cb = new ClueBuffer("22, 2 Across across means to go over (4)", "across");
            expect(parts.caption).toEqual("22, 2");
            expect(parts.clue).toEqual("Across across means to go over (4)", "across");
        });
    });

    describe('Letter Counts', () => {
        it('should  extract a simple letter count', () => {
            cb = new ClueBuffer("1 This is clue 1 down (4)", "across");
            expect(cb.letterCount).toEqual("(4)");
        });
    });

    describe('setGridReferences', () => {

        it('should set a simple caption (1)', () => {
            cb = new ClueBuffer("2 This is a clue (2)", "across");

            expect(Array.isArray(cb.gridRefs)).toBeTruthy;
            expect(cb.gridRefs.length).toEqual(1);
            expect(cb.gridRefs[0].anchor).toEqual(2);
            expect(cb.gridRefs[0].direction).toEqual("across");
        });

        it('should read a simple caption (2)', () => {
            cb = new ClueBuffer("33 xxx (3)", "down");

            expect(Array.isArray(cb.gridRefs)).toBeTruthy;
            expect(cb.gridRefs.length).toEqual(1);
            expect(cb.gridRefs[0].anchor).toEqual(33);
            expect(cb.gridRefs[0].direction).toEqual("down");
        });

        it('should read a simple multi-entry caption', () => {
            cb = new ClueBuffer("2, 3", "across");

            expect(Array.isArray(cb.gridRefs)).toBeTruthy;
            expect(cb.gridRefs.length).toEqual(2);
            expect(cb.gridRefs[0].anchor).toEqual(2);
            expect(cb.gridRefs[0].direction).toEqual("across");
            expect(cb.gridRefs[1].anchor).toEqual(3);
            expect(cb.gridRefs[1].direction).toEqual("across");
        });

        it('should read a complex multi-entry caption (1)', () => {
            cb = new ClueBuffer("2, 3 down, 4", "across");

            expect(Array.isArray(cb.gridRefs)).toBeTruthy;
            expect(cb.gridRefs.length).toEqual(3);
            expect(cb.gridRefs[0].anchor).toEqual(2);
            expect(cb.gridRefs[0].direction).toEqual("across");
            expect(cb.gridRefs[1].anchor).toEqual(3);
            expect(cb.gridRefs[1].direction).toEqual("down");
            expect(cb.gridRefs[2].anchor).toEqual(4);
            expect(cb.gridRefs[2].direction).toEqual("across");
        });

        it('should read a complex multi-entry caption (2)', () => {
            cb = new ClueBuffer("2, 3 across, 4 down", "down");

            expect(Array.isArray(cb.gridRefs)).toBeTruthy;
            expect(cb.gridRefs.length).toEqual(3);
            expect(cb.gridRefs[0].anchor).toEqual(2);
            expect(cb.gridRefs[0].direction).toEqual("down");
            expect(cb.gridRefs[1].anchor).toEqual(3);
            expect(cb.gridRefs[1].direction).toEqual("across");
            expect(cb.gridRefs[2].anchor).toEqual(4);
            expect(cb.gridRefs[2].direction).toEqual("down");
        });
    });
});
