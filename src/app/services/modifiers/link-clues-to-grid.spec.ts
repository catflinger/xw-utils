import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { LinkCluesToGrid } from './link-clues-to-grid';
import { PuzzleM } from './mutable-model/puzzle-m';
import { QuillDelta, ClueGroup } from 'src/app/model/interfaces';
import { GridM } from './mutable-model/grid-m';
import { GridCell } from 'src/app/model/grid-cell';
import { ClueM } from './mutable-model/clue-m';
import { GridCellM } from './mutable-model/grid-cell-m';

describe('LinkCLuesToGrid modifier', () => {

    describe('readGridReferences', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        it('should read a simple caption (1)', () => {
            const result = LinkCluesToGrid["readGridReferences"]("2", "across");

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toEqual(1);
            expect(result[0].clueNumber).toEqual(2);
            expect(result[0].clueGroup).toEqual("across");
        });

        it('should read a simple caption (2)', () => {
            const result = LinkCluesToGrid["readGridReferences"]("33", "down");

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toEqual(1);
            expect(result[0].clueNumber).toEqual(33);
            expect(result[0].clueGroup).toEqual("down");
        });

        it('should read a simple multi-entry caption', () => {
            const result = LinkCluesToGrid["readGridReferences"]("2, 3", "across");

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toEqual(2);
            expect(result[0].clueNumber).toEqual(2);
            expect(result[0].clueGroup).toEqual("across");
            expect(result[1].clueNumber).toEqual(3);
            expect(result[1].clueGroup).toEqual("across");
        });

        it('should read a complex multi-entry caption (1)', () => {
            const result = LinkCluesToGrid["readGridReferences"]("2, 3 down, 4", "across");

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toEqual(3);
            expect(result[0].clueNumber).toEqual(2);
            expect(result[0].clueGroup).toEqual("across");
            expect(result[1].clueNumber).toEqual(3);
            expect(result[1].clueGroup).toEqual("down");
            expect(result[2].clueNumber).toEqual(4);
            expect(result[2].clueGroup).toEqual("across");
        });

        it('should read a complex multi-entry caption (2)', () => {
            const result = LinkCluesToGrid["readGridReferences"]("2, 3 across, 4 down", "down");

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toEqual(3);
            expect(result[0].clueNumber).toEqual(2);
            expect(result[0].clueGroup).toEqual("down");
            expect(result[1].clueNumber).toEqual(3);
            expect(result[1].clueGroup).toEqual("across");
            expect(result[2].clueNumber).toEqual(4);
            expect(result[2].clueGroup).toEqual("down");
        });
    });

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

            it('should process an across clue', () => {
                const modifier = new LinkCluesToGrid();
                const puzzle = getPuzzleWithNoClues();
                addTestClues(puzzle);
                modifier.exec(puzzle);

                expect(puzzle.clues.length).toEqual(3);

                // 1 across
                let clue = puzzle.clues[0];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(1);
                let entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(4);
                let cells = entry.cellIds;

                expect(cells[0]).toEqual("00");
                expect(cells[1]).toEqual("10");
                expect(cells[2]).toEqual("20");
                expect(cells[3]).toEqual("30");
            });

            it('should process a down clue', () => {
                const modifier = new LinkCluesToGrid();
                const puzzle = getPuzzleWithNoClues();
                addTestClues(puzzle);
                modifier.exec(puzzle);

                expect(puzzle.clues.length).toEqual(3);

                // 1 down
                let clue = puzzle.clues[1];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(1);
                let entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(3);
                let cells = entry.cellIds;

                expect(cells[0]).toEqual("00");
                expect(cells[1]).toEqual("01");
                expect(cells[2]).toEqual("02");
            });

            it('should process a mixed clue', () => {
                const modifier = new LinkCluesToGrid();
                const puzzle = getPuzzleWithNoClues();
                addTestClues(puzzle);
                modifier.exec(puzzle);

                expect(puzzle.clues.length).toEqual(3);

                // 2, 1 down
                let clue = puzzle.clues[2];
                expect(Array.isArray(clue.entries)).toBeTruthy;
                expect(clue.entries.length).toEqual(2);

                // 2 across - 1st entry
                let entry = clue.entries[0];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(5);
                let cells = entry.cellIds;

                // this entry is labelled 2 across in teh grid
                expect(cells[0]).toEqual("50");
                expect(cells[1]).toEqual("60");
                expect(cells[2]).toEqual("70");
                expect(cells[3]).toEqual("80");
                expect(cells[4]).toEqual("90");

                // 2 across - 2nd entry
                entry = clue.entries[1];
                expect(Array.isArray(entry.cellIds)).toBeTruthy;
                expect(entry.cellIds.length).toEqual(3);
                cells = entry.cellIds;

                // this entry is labelled 1 down in the grid
                expect(cells[0]).toEqual("00");
                expect(cells[1]).toEqual("01");
                expect(cells[2]).toEqual("02");
            });
        });
    });
});

function addTestClues(puzzle: PuzzleM) {
    let start, end: GridCellM;

    // add 1 across
    puzzle.clues.push(makeClue("1", "across", "1 This is one across (4)"));
    start = puzzle.grid.cells.find(c => c.x === 0 && c.y === 0);
    end = puzzle.grid.cells.find(c => c.x === 4 && c.y === 0);
    start.caption = "1";
    end.light = false;

    // add 1 down
    puzzle.clues.push(makeClue("1", "down", "1 This is one down (3)"));
    end = puzzle.grid.cells.find(c => c.x === 0 && c.y === 3);
    end.light = false;

    // add 2 across
    puzzle.clues.push(makeClue("2, 1 down", "across", "2, 1 down This has two grid entries (4, 3)"));
    start = puzzle.grid.cells.find(c => c.x === 5 && c.y === 0);
    start.caption = "2";
}

function makeClue(caption: string, group: ClueGroup, text: string): ClueM {
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
        warnings: []
    };
}

function getPuzzleWithNoClues(): PuzzleM {

    let puzzle: PuzzleM = getEmptyPuzzle();

    let grid: GridM = {
        properties: {
            style: "standard",
            symmetrical: false,
            size: {
                across: 10,
                down: 10,
            }
        },
        cells: []
    }

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            let cell: GridCell = {
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
    puzzle.grid = grid;

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
            blogable: true,
            solveable: false,
            gridable: false,
            source: null,
        },
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