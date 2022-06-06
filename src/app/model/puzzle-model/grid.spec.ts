import { TestBed } from '@angular/core/testing';
import { Grid } from './grid';
import { IGridCell, IGrid } from '../interfaces';

describe('Grid', () => {

    describe('construction', () => {

        it('should construct from simple data', () => {
            let grid = new Grid(emptyGridData());
            expect(grid).toBeTruthy();
        });

        // TO DO:write some more detailed tests,including malformed data
    });

    describe('navigation', () => {

        it('should navigate across', () => {
            let grid = new Grid(emptyGridData());
            let nav = grid.getNavigator("00", "right");

            let cell = nav.next();
            expect(cell.done).not.toBeTruthy();
            expect(cell.value.id).toEqual("00");

            cell = nav.next();
            expect(cell.done).not.toBeTruthy();
            expect(cell.value.id).toEqual("10");

            cell = nav.next();
            cell = nav.next();
            cell = nav.next();
            expect(cell.done).not.toBeTruthy();
            expect(cell.value.id).toEqual("40");

            cell = nav.next();
            expect(cell.done).not.toBeTruthy();
            expect(cell.value.id).toEqual("01");
        });

        // TO DO: write some more detailed tests,including malformed data
    });

    describe('getEntry', () => {

        it('should find 1 across from 1st cell', () => {
            let grid = new Grid(testGridData());
            let startCell = grid.cells.find(c => c.id === "00");

            let entry = grid["getEntry"](startCell, "across");
            expect(entry.length).toEqual(5);
            expect(entry[0].id).toEqual("00");
            expect(entry[1].id).toEqual("10");
            expect(entry[2].id).toEqual("20");
            expect(entry[3].id).toEqual("30");
            expect(entry[4].id).toEqual("40");
        });

        it('should find 1 across from middle cell', () => {
            let grid = new Grid(testGridData());
            let startCell = grid.cells.find(c => c.id === "20");

            let entry = grid["getEntry"](startCell, "across");
            expect(entry.length).toEqual(5);
            expect(entry[0].id).toEqual("00");
            expect(entry[1].id).toEqual("10");
            expect(entry[2].id).toEqual("20");
            expect(entry[3].id).toEqual("30");
            expect(entry[4].id).toEqual("40");
        });

        it('should find 2 down from middle cell', () => {
            let grid = new Grid(testGridData());
            let startCell = grid.cells.find(c => c.id === "20");

            let entry = grid["getEntry"](startCell, "down");
            expect(entry.length).toEqual(5);
            expect(entry[0].id).toEqual("20");
            expect(entry[1].id).toEqual("21");
            expect(entry[2].id).toEqual("22");
            expect(entry[3].id).toEqual("23");
            expect(entry[4].id).toEqual("24");
        });
    });

    describe('getGridEntriesForCaption', () => {

        it('should find entries for 1 across', () => {
            let grid = new Grid(testGridData());

            let entry = grid.getGridEntryFromReference({ id: "", anchor: 1, direction: "across" });
            expect(entry.length).toEqual(5);
            expect(entry[0].id).toEqual("00");
            expect(entry[1].id).toEqual("10");
            expect(entry[2].id).toEqual("20");
            expect(entry[3].id).toEqual("30");
            expect(entry[4].id).toEqual("40");
        });

        it('should find entries for 4 across', () => {
            let grid = new Grid(testGridData());

            let entry = grid.getGridEntryFromReference({ id: "", anchor: 4, direction: "across" });
            expect(entry.length).toEqual(5);
            expect(entry[0].id).toEqual("02");
            expect(entry[1].id).toEqual("12");
            expect(entry[2].id).toEqual("22");
            expect(entry[3].id).toEqual("32");
            expect(entry[4].id).toEqual("42");
        });

        it('should find entries for 4 down', () => {
            let grid = new Grid(testGridData());

            let entry = grid.getGridEntryFromReference({ id: "", anchor: 4, direction: "down" });
            expect(entry.length).toEqual(3);

            expect(entry[0].id).toEqual("02");
            expect(entry[1].id).toEqual("03");
            expect(entry[2].id).toEqual("04");
        });
    });
});


/*
1 . 2 . 3 
x x . x .
4 . . . .
. x . x .
5 . . . .
*/
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

    cells.push(data.cells.find(c => c.id === "01"))
    cells.push(data.cells.find(c => c.id === "11"))
    cells.push(data.cells.find(c => c.id === "31"))

    cells.push(data.cells.find(c => c.id === "13"))
    cells.push(data.cells.find(c => c.id === "33"))

    cells.forEach(c => c.light = false);

    return data;
}

function emptyGridData(): IGrid {

    let grid: IGrid = {
        properties: {
            numbered: true,
            style: "standard",
            symmetrical: false,
            showCaptions: true,
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
                caption: null,
                content: "",
                rightBar: false,
                bottomBar: false,
                highlight: false,
                light: true,
                shading: "",
                edit: false,
                hidden: false,
            }
            grid.cells.push(cell);
        }
    }

    return grid;
}
