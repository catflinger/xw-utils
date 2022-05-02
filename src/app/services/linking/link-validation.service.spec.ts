import { TestBed } from '@angular/core/testing';

import { LinkValidationService } from './link-validation.service';
import { ClueGroup, IGridCell, IPuzzle, IClue, IGrid } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';

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

function addGoodClue(clues: IClue[]) {
    clues.push(makeClue(
        "0123",
        "12",
        "across",
        "This is a clue (7)",
    ));
}

 function addClueWithMissingNumber(clues: IClue[]) {
    clues.push(makeClue(
        "0123",
        "12",
        "across",
        "This is a clue (7)",
    ));
}

function emptyGridData(): IGrid {

    let grid: IGrid = {
        properties: {
            numbered: true,
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
            let cell: IGridCell = {
                id: x.toString() + y.toString(),
                x,
                y,
                anchor: null,
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

function getEmptyPuzzle(): IPuzzle {
    return {
        clues: [],
        grid: null,
        revision: 0,
        uncommitted: false,
        ready: true,
        info: {
            id: "abc123",
            title: "untitled",
            puzzleDate: new Date(),
            provider: "text",
            setter: "anon",
            wordpressId: null,
            instructions: null,
        },
        options: {
            linkMethod: "auto",
            //setGridRefsFromCaptions: true,
        },
        provision: null,
        notes: {
            header: { ops:[] },
            body:  { ops:[] },
            footer:  { ops:[] },
        },
        publishOptions: {
            useThemeDefaults: false,
            showClueCaptions: true,
            showClueGroups: true,
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
        },
    };
}

function makeClue(id: string, caption: string, group: ClueGroup, text: string): IClue {
    return {
        id,
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
        link: {
            warning: null,
            gridRefs: [],
        },
        chunks: [],
        warnings: [],
        //gridRefs,
    };
}

function testGridData() {
    let data = emptyGridData();

    // set the captions
    let cell = data.cells.find(c => c.id === "00");
    cell.anchor = 1;

    cell = data.cells.find(c => c.id === "20");
    cell.anchor = 2;

    cell = data.cells.find(c => c.id === "40");
    cell.anchor = 3;

    cell = data.cells.find(c => c.id === "02");
    cell.anchor = 4;

    cell = data.cells.find(c => c.id === "04");
    cell.anchor = 5;

    // set the blacked-out squares
    let cells: IGridCell[] = [];

    cells.push(data.cells.find(c => c.id === "11"))
    cells.push(data.cells.find(c => c.id === "31"))
    cells.push(data.cells.find(c => c.id === "13"))
    cells.push(data.cells.find(c => c.id === "33"))

    cells.forEach(c => c.light = false);

    return data;
}

