import { TestBed } from '@angular/core/testing';

import { LinkValidationService } from './link-validation.service';
import { GridCellM } from 'src/app/modifiers/mutable-model/grid-cell-m';
import { GridM } from 'src/app/modifiers/mutable-model/grid-m';
import { QuillDelta, ClueGroup, IGridReference } from 'src/app/model/interfaces';
import { PuzzleM } from 'src/app/modifiers/mutable-model/puzzle-m';
import { ClueM } from 'src/app/modifiers/mutable-model/clue-m';
import { Puzzle } from 'src/app/model/puzzle';

describe('LinkValidationService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be validate empty puzzle', () => {
        const service: LinkValidationService = TestBed.get(LinkValidationService);

        let puzzle = new Puzzle(getEmptyPuzzle());
        expect(service.validatePuzzle(puzzle).length).toEqual(0);
    });

    it('should validate a good clue', () => {
        const service: LinkValidationService = TestBed.get(LinkValidationService);

        let puzzleData = getEmptyPuzzle();
        puzzleData.grid = emptyGridData();
        addGoodClue(puzzleData.clues);

        let puzzle = new Puzzle(puzzleData);
        let warnings = service.validatePuzzle(puzzle);
        expect(warnings.length).toEqual(0);
    });

    xit('should detect a missing clue number', () => {
        const service: LinkValidationService = TestBed.get(LinkValidationService);

        let puzzleData = getEmptyPuzzle();
        puzzleData.grid = emptyGridData();
        addClueWithMissingNumber(puzzleData.clues);

        let puzzle = new Puzzle(puzzleData);
        let warnings = service.validatePuzzle(puzzle);
        expect(warnings.length).toEqual(1);
        expect(warnings[0].clueId).toEqual("0123");
    });

});
function addGoodClue(clues: ClueM[]) {
    clues.push(makeClue(
        "0123",
        "12",
        "across",
        "This is a clue (7)",
        [{
       clueNumber: 12,
       clueGroup: "across",     
        }]
    ));
}


 function addClueWithMissingNumber(clues: ClueM[]) {
    clues.push(makeClue(
        "0123",
        "12",
        "across",
        "This is a clue (7)",
        [{
       clueNumber: 12,
       clueGroup: "across",     
        }]
    ));
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

function makeClue(id: string, caption: string, group: ClueGroup, text: string, gridRefs: IGridReference[]): ClueM {
    return {
        id,
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
        entries: [],
        chunks: [],
        warnings: [],
        gridRefs,
    };
}

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

