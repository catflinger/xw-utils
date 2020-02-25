import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { LinkCluesToGrid } from './link-clues-to-grid';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { QuillDelta, ClueGroup, IGridReference } from 'src/app/model/interfaces';
import { GridM } from '../mutable-model/grid-m';
import { GridCell } from 'src/app/model/grid-cell';
import { ClueM } from '../mutable-model/clue-m';
import { GridCellM } from '../mutable-model/grid-cell-m';

describe('LinkCLuesToGrid modifier', () => {


    describe('exec', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        it('should pass with no grid', () => {
            const modifier = new LinkCluesToGrid();
            const puzzle = getEmptyPuzzle();
            expect(() => modifier.exec(puzzle)).not.toThrow();
        });

        it('should pass with no clues', () => {
            const modifier = new LinkCluesToGrid();
            const puzzle = getPuzzleWithNoClues();
            expect(() => modifier.exec(puzzle)).not.toThrow();
        });

        describe('create grid references', () => {
            let puzzle: PuzzleM;

            beforeAll(() => {
                const modifier = new LinkCluesToGrid();
                puzzle = getPuzzleWithNoClues();
                addTestClues(puzzle);
                modifier.exec(puzzle);
            })

            it('should have processed all clues', () => {
                expect(puzzle.clues.length).toEqual(3);
            });

            it('should process an across clue', () => {

                // 1st clue - 1 (across clue)
                const clue = puzzle.clues[0];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(1);
                const entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(5);
                const cells = entry.cellIds;

                expect(cells[0]).toEqual("00");
                expect(cells[1]).toEqual("10");
                expect(cells[2]).toEqual("20");
                expect(cells[3]).toEqual("30");
                expect(cells[4]).toEqual("40");
            });

            it('should process a down clue', () => {

                // 2nd clue - 2 (down clue)
                let clue = puzzle.clues[1];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(1);
                let entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(5);
                let cells = entry.cellIds;

                expect(cells[0]).toEqual("20");
                expect(cells[1]).toEqual("21");
                expect(cells[2]).toEqual("22");
                expect(cells[3]).toEqual("23");
                expect(cells[4]).toEqual("24");
            });

            it('should process a mixed clue', () => {

                // 3rd clue - 5, 3 down (across clue)
                let clue = puzzle.clues[2];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(2);

                // 5 across - 1st entry
                let entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(5);
                let cells = entry.cellIds;

                // this entry is labelled 5 across in teh grid
                expect(cells[0]).toEqual("04");
                expect(cells[1]).toEqual("14");
                expect(cells[2]).toEqual("24");
                expect(cells[3]).toEqual("34");
                expect(cells[4]).toEqual("44");

                // 2 across - 2nd entry
                entry = clue.entries[1];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(5);
                cells = entry.cellIds;

                // this entry is labelled 3 down in the grid
                expect(cells[0]).toEqual("40");
                expect(cells[1]).toEqual("41");
                expect(cells[2]).toEqual("42");
                expect(cells[3]).toEqual("43");
                expect(cells[4]).toEqual("44");
            });
        });
    });
});

function addTestClues(puzzle: PuzzleM) {

/*  THE GRID
0| 1 . 2 . 3 
1| . x . x .
2| 4 . . . .
3| . x . x .
4| 5 . . . .
 -----------
   0 1 2 3 4
*/


    // add 1 across
    puzzle.clues.push(makeClue(
        "1", 
        "across", 
        "This is one across (5)",
        [
            { clueNumber: 1, clueGroup: "across" }
        ]
    ));

    // add 2 down
    puzzle.clues.push(makeClue(
        "2", 
        "down", 
        "This is 2 down (5)",
        [
            { clueNumber: 2, clueGroup: "down", }
        ]
    ));

    // add 5 across
    puzzle.clues.push(makeClue(
        "5, 3 down", 
        "across", 
        "This has two grid entries (5, 5)",
        [
            { clueNumber: 5, clueGroup: "across" },
            { clueNumber: 3, clueGroup: "down" }
        ]
    ));
}

function makeClue(caption: string, group: ClueGroup, text: string, gridRefs: IGridReference[]): ClueM {
    return {
        id: "",
        group,
        caption,
        text,
        letterCount: "",
        answer: "",
        solution: "",
        annotation: "",
        redirect: false,
        format: "",
        comment: null,
        highlight: false,
        entries: [],
        chunks: [],
        warnings: [],
        gridRefs,
    };
}

function getPuzzleWithNoClues(): PuzzleM {

    let puzzle: PuzzleM = getEmptyPuzzle();
    puzzle.grid = testGridData();

    return puzzle;
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
            clueStyle: {
                color: "#000000",
                bold: false,
                italic: false,
                underline: false,
            },
            answerStyle: {
                color: "#000000",
                bold: false,
                italic: false,
                underline: false,
            },
            definitionStyle: {
                color: "#000000",
                bold: false,
                italic: false,
                underline: false,
            },
            includeGrid: false,
            layout: "table",
            spacing: "small",
        },
    };
}

/*  THE GRID
0| 1 . 2 . 3 
1| . x . x .
2| 4 . . . .
3| . x . x .
4| 5 . . . .
 -----------
   0 1 2 3 4
*/

function testGridData() {
    let data = emptyGridData();

    // set the captions
    let cell = data.cells.find(c => c.id === "00");
    cell.caption = "1";

    cell = data.cells.find(c => c.id === "20");
    cell.caption = "2";

    cell = data.cells.find(c => c.id === "40");
    cell.caption = "3";

    cell = data.cells.find(c => c.id === "02");
    cell.caption = "4";

    cell = data.cells.find(c => c.id === "04");
    cell.caption = "5";

    // set the blacked-out squares
    let cells: GridCellM[] = [];

    cells.push(data.cells.find(c => c.id === "11"))
    cells.push(data.cells.find(c => c.id === "31"))
    cells.push(data.cells.find(c => c.id === "13"))
    cells.push(data.cells.find(c => c.id === "33"))

    cells.forEach(c => c.light = false);

    return data;
}

function emptyGridData(): GridM {

    let grid: GridM = {
        properties: {
            style: "standard",
            symmetrical: false,
            size: {
                across: 5,
                down: 5,
            }
        },
        cells: []
    }

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            let cell: GridCellM = {
                id: x.toString() + y.toString(),
                x,
                y,
                caption: "",
                content: "",
                rightBar: false,
                bottomBar: false,
                highlight: false,
                light: true,
                shading: "",
                edit: false,
            }
            grid.cells.push(cell);
        }
    }

    return grid;
}
