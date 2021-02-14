import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { IPuzzle, IClue, ClueGroup, IGridReference } from '../../model/interfaces';
import { SetRedirects } from './set-redirects';

describe('SetRedirects modifier', () => {

    describe('exec', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        it('should set redirects in an empty puzzle', () => {
            let puzzle = getEmptyPuzzle();
            expect(() => new SetRedirects().exec(puzzle)).not.toThrow();
        });

        it('should set redirects', () => {
            let puzzle = getEmptyPuzzle();
            addTestClues(puzzle);
            new SetRedirects().exec(puzzle);

            expect(puzzle.clues.length).toEqual(3);
            expect(puzzle.clues[0].caption).toEqual("5, 3 down");
            expect(puzzle.clues[1].caption).toEqual("1");
            expect(puzzle.clues[2].caption).toEqual("2");
        });

    });
});

function addTestClues(puzzle: IPuzzle) {

    // add 5 across
    puzzle.clues.push(makeClue(
        "5, 3 down", 
        "across", 
        "This has two grid entries (5, 5)",
        [
            {
                id: "",
                label: 5,
                direction: "across",
            },
            {
                id: "",
                label: 3,
                direction: "down",
            }
        ]
    ));

    puzzle.clues.push(makeClue(
        "1", 
        "across", 
        "This is one across (5)",
        [{
            id: "",
            label: 1,
            direction: "across"
        }]
    ));

    puzzle.clues.push(makeClue(
        "2", 
        "down", 
        "This is 2 down (5)",
        [{
            id: "",
            label: 2,
            direction: "down"
        }]
    ));

}


function makeClue(caption: string, group: ClueGroup, text: string, gridRefs: IGridReference[]): IClue {
    return {
        id: "",
        group,
        caption,
        text,
        letterCount: "",
        answers: [""],
        solution: "",
        annotation: "",
        redirect: null,
        format: "",
        comment: null,
        highlight: false,
        chunks: [],
        warnings: [],
        link: {
            warning: null,
            gridRefs,
        }
    };
}

function getEmptyPuzzle(): IPuzzle {
    return {
        clues: [],
        grid: null,
        //linked: false,
        revision: 0,
        ready: true,
        uncommitted: false,
        options: {
            setGridRefsFromCaptions: true,
        },
        info: {
            id: "abc123",
            title: "untitled",
            puzzleDate: new Date(),
            provider: "text",
            setter: "anon",
            wordpressId: null,
            instructions: null,
        },
        provision: null,
        notes: {
            header: { ops: [] },
            body: { ops: [] },
            footer: { ops: [] },
        },
        publishOptions: {
            textStyles: [
                {
                    name: "clue",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-clue",
                },
                {
                    name: "answer",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-answer",
                },
                {
                    name: "definition",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-definition",
                },
            ],
            textCols: [
                {
                    caption: "answer",
                    style: "answer",
                }
            ],
            includeGrid: false,
            layout: "table",
            spacing: "small",
            useDefaults: false,
        },
    };
}

