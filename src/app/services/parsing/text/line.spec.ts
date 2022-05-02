import { TestBed } from '@angular/core/testing';
import { Line } from './line';

describe('Line', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const line: Line = new Line("", 1);
        expect(line).toBeTruthy();
    });

    it('should recognise simple lines', () => {
        expect(new Line(testData.simple.clue, 1).lineType).toEqual("clue");
        expect(new Line(testData.simple.clueStart, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.simple.clueEnd, 1).lineType).toEqual("partialClueEnd");
        expect(new Line(testData.simple.clueMiddle, 1).lineType).toEqual("unknown");
        expect(new Line(testData.simple.empty1, 1).lineType).toEqual("empty");
        expect(new Line(testData.simple.empty2, 1).lineType).toEqual("empty");
        expect(new Line(testData.simple.empty3, 1).lineType).toEqual("empty");
        expect(new Line(testData.simple.marker1, 1).lineType).toEqual("acrossMarker");
        expect(new Line(testData.simple.marker2, 1).lineType).toEqual("acrossMarker");
        expect(new Line(testData.simple.marker3, 1).lineType).toEqual("downMarker");
        expect(new Line(testData.simple.marker4, 1).lineType).toEqual("downMarker");
    });

    it('should recognise letter counts', () => {
        expect(new Line(testData.letterCounts.azed, 1).lineType).toEqual("partialClueEnd");
        expect(new Line(testData.letterCounts.withSpaces, 1).lineType).toEqual("partialClueEnd");
        expect(new Line(testData.letterCounts.withHyphen, 1).lineType).toEqual("partialClueEnd");
        expect(new Line(testData.letterCounts.twoWords, 1).lineType).toEqual("partialClueEnd");

        expect(new Line(testData.letterCounts.bad1, 1).lineType).toEqual("unknown");
        expect(new Line(testData.letterCounts.bad2, 1).lineType).toEqual("unknown");
        expect(new Line(testData.letterCounts.bad3, 1).lineType).toEqual("unknown");
        expect(new Line(testData.letterCounts.bad4, 1).lineType).toEqual("unknown");
    });

    it('should recognise clue starts', () => {
        expect(new Line(testData.starts.azed, 1).lineType).toEqual("unknown");
        expect(new Line(testData.starts.azed, 1, { azedFeatures: true, captionStyle: "numbered", allowPostamble: true, allowPreamble: true }).lineType).toEqual("partialClueStart");

        expect(new Line(testData.starts.comma, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.starts.oneDigit, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.starts.space1, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.starts.space2, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.starts.space3, 1).lineType).toEqual("partialClueStart");
        expect(new Line(testData.starts.twoDigit, 1).lineType).toEqual("partialClueStart");
    });

});

const testData = {
    simple: {
        clue: "1 A clue (4)",
        clueStart: "1 The start ",
        clueMiddle: "the middle ",
        clueEnd: "the end (4)",
        empty1: "",
        empty2: " ",
        empty3: " \t  ",
        marker1: "across",
        marker2: "ACROSS",
        marker3: "down",
        marker4: "DOWN",
    },
    letterCounts: {
        twoWords: "clue (2,3)",
        withSpaces: "clue (2, 3)",
        withHyphen: "clue (2-3)",
        azed: "clue (2 words)",
        bad1: "clue (1",
        bad2: "clue 1)",
        bad3: "clue ()",
        bad4: "clue (-)",
    },
    starts: {
        oneDigit: "1 a clue",
        twoDigit: "12 a clue",
        comma: "1, 2 a clue",
        space1: "1  a clue",
        space2: " 1   a clue",
        space3: " 1 ,2  a clue",
        azed: "*21 a clue",
    },

}
