import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { IPuzzle, IClue, ClueGroup, IGridReference } from '../../model/interfaces';
import { SortClues } from './sort-clues';

describe('SortClues modifier', () => {

    describe('exec', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        it('should sort an empty puzzle', () => {
            let puzzle = getEmptyPuzzle();
            expect(new SortClues().exec(puzzle)).not.toThrow();
        });

        it('should sort an numerical puzzle', () => {
            let puzzle = getEmptyPuzzle();
            addTestClues(puzzle);
            new SortClues().exec(puzzle);

            expect(puzzle.clues.length).toEqual(3);
            expect(puzzle.clues[0].caption).toEqual("1");
            expect(puzzle.clues[1].caption).toEqual("2");
            expect(puzzle.clues[1].caption).toEqual("5, 3 down");
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
                anchor: 5,
                direction: "across",
            },
            {
                id: "",
                anchor: 3,
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
            anchor: 1,
            direction: "across"
        }]
    ));

    puzzle.clues.push(makeClue(
        "2", 
        "down", 
        "This is 2 down (5)",
        [{
            id: "",
            anchor: 2,
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
            linkMethod: "auto",
            //setGridRefsFromCaptionsX: true,
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
            showClueCaptions: true,
            showClueGroups: true,
            textStyles: [
                {
                    name: "clue",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: ""
                },
                {
                    name: "answer",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: ""
                },
                {
                    name: "definition",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: ""
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
        },
    };
}
