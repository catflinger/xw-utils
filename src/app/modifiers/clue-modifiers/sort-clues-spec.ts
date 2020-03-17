import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { ClueGroup, QuillDelta } from 'src/app/model/interfaces';
import { GridEntryM } from '../mutable-model/grid-entry-m';
import { ClueM } from '../mutable-model/clue-m';
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

function addTestClues(puzzle: PuzzleM) {

    // add 5 across
    puzzle.clues.push(makeClue(
        "5, 3 down", 
        "across", 
        "This has two grid entries (5, 5)",
        [
            {
                cellIds: [],
                gridRef: {
                    caption: "5",
                    direction: "across"
                },
            },
            {
                cellIds: [],
                gridRef: {
                    caption: "3",
                    direction: "down"
                }
            }
        ]
    ));

    puzzle.clues.push(makeClue(
        "1", 
        "across", 
        "This is one across (5)",
        [{
            cellIds: [],
            gridRef: {
                caption: "1",
                direction: "across"
            }
        }]
    ));

    puzzle.clues.push(makeClue(
        "2", 
        "down", 
        "This is 2 down (5)",
        [{
            cellIds: [],
            gridRef: {
                caption: "2",
                direction: "down"
            }
        }]
    ));

}

function makeClue(caption: string, group: ClueGroup, text: string, entries: GridEntryM[]): ClueM {
    return {
        id: "",
        group,
        caption,
        text,
        letterCount: "",
        answers: [""],
        solution: "",
        annotation: "",
        redirect: false,
        format: "",
        comment: null,
        highlight: false,
        chunks: [],
        warnings: [],
        entries,
    };
}

function getEmptyPuzzle(): PuzzleM {
    return {
        clues: [],
        grid: null,
        linked: false,
        revision: 0,
        info: {
            id: "abc123",
            title: "untitled",
            puzzleDate: new Date(),
            provider: "text",
            setter: "anon",
            wordpressId: null,
        },
        capability: {
            ready: true,
            blogable: true,
            solveable: false,
            gridable: false,
        },
        provision: null,
        notes: {
            header: new QuillDelta(),
            body: new QuillDelta(),
            footer: new QuillDelta(),
        },
        publishOptions: {
            textStyles: [
                {
                    name: "clue",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                {
                    name: "answer",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                {
                    name: "definition",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
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
