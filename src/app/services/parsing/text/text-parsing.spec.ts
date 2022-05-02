// End-to-end parsing tests.  Utilises both tokeniser and Parser

import { TestBed } from '@angular/core/testing';
import { TextParsingService } from './text-parsing-service';
import { IParseContext } from './text-parsing-context';
import { TokeniserService } from './tokeniser/tokeniser.service';

import { data as testData } from "./mocks/pdf-extract-1";
import { Grid } from 'src/app/model/puzzle-model/grid';
import { GridStyle, ClueGroup, IGridCell, IGrid } from 'src/app/model/interfaces';

let tokeniser: TokeniserService = new TokeniserService(null);

describe('TextParsing', () => {
    
    describe('Full Puzzle Test', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        it('should repair a missing letter count', () => {
            let result = runParser(testData);

            expect(result.error).toEqual(null);
            expect(result.clues.length).toEqual(28);
            expect(result.warnings.length).toEqual(2);

            // tests adding missing wordcount followed by a complete clue
            expect(result.clues[0].caption).toEqual("1");
            expect(result.clues[0].text).toEqual("John, for one, a powerless former president (7)");
            expect(result.warnings[0].lineNumber).toEqual(8);
            expect(result.warnings[0].message).toContain("The amended clue is: 1 John, for one, a powerless former president (7)");

            // tests adding missing wordcount followed by a clue start only
            expect(result.clues[17].caption).toEqual("4");
            expect(result.clues[17].text).toEqual("Disengaged, to some extent, about girl (5)");
            expect(result.warnings[1].lineNumber).toEqual(45);
            expect(result.warnings[1].message).toContain("The amended clue is: 4 Disengaged, to some extent, about girl (5)");

            // tests a random number in the text of a clue, including the clue end
            expect(result.clues[5].caption).toEqual("12");
            expect(result.clues[5].text).toEqual("It will disappoint very little 2 wife in large chair (5,4)");

            // tests a random number in the text of a clue, without the clue end
            expect(result.clues[12].caption).toEqual("23");
            expect(result.clues[12].text).toEqual("One teasing old queen, 2 perhaps, about obesity in a heartless manner (7)");
        });
    });
});

function runParser(data: any) {
    const parseData = getTestData(data);

    const service: TextParsingService = new TextParsingService(tokeniser);

    let parser = service.parser(parseData, { allowPostamble: true, allowPreamble: true, captionStyle: "numbered" });
    let context = parser.next();

    while(!context.done) {
        context = parser.next();
    }

    return context.value as IParseContext;
}

function getTestData(data: any): any {
    let grid = data.gridData;
    let counter = 1;

    for(let y = 0; y < grid.properties.size.down; y++) {
        for(let x = 0; x < grid.properties.size.across; x++) {
            let cell = grid.cells.find(c => c.x === x && c.y === y);

            // first try for the first cell of an across word
            let next = nextCellAcross(grid, cell);
            let previous = previousCellAcross(grid, cell);
            let isStart = isStartCell(grid.properties.style, cell, previous, next, "across");

            if (!isStart) {
                // no joy, so try for the first cell of a down word
                next = nextCellDown(grid, cell);
                previous = previousCellDown(grid, cell);
                isStart = isStartCell(grid.properties.style, cell, previous, next, "down");
            }

            if (isStart) {
                cell.caption = counter;
                counter++;
            } else {
                cell.caption = null;
            }
        }
    }
    data.grid = new Grid(data.gridData);

    return data;
}

function isStartCell(gridStyle: GridStyle, cell: IGridCell, previous: IGridCell, next: IGridCell, direction: ClueGroup): boolean {
    let result: boolean = false;

    if (gridStyle === "standard") {
        result = cell.light && 
            next && next.light && 
            (!previous || !previous.light); 
    
    } else if (gridStyle === "barred" && direction === "across") {
        result = cell.light && 
            !cell.rightBar &&
            next &&
            (!previous || previous.rightBar); 

    } else if (gridStyle === "barred" && direction === "down") {
        result = cell.light && 
            !cell.bottomBar &&
            next &&
            (!previous || previous.bottomBar); 
    }

    return result;
}

function nextCellAcross(grid: IGrid, cell: IGridCell): IGridCell {
    const x = cell.x;
    const y = cell.y;

    return x < grid.properties.size.across - 1 ? grid.cells.find(c => c.y === y && c.x === x + 1) : null; 
}

function previousCellAcross(grid: IGrid, cell: IGridCell): IGridCell {
    const x = cell.x;
    const y = cell.y;

    return x > 0 ? grid.cells.find(c => c.y === y && c.x === x - 1) : null; 
}

function nextCellDown(grid: IGrid, cell: IGridCell): IGridCell {
    const x = cell.x;
    const y = cell.y;

    return y < grid.properties.size.down - 1 ? grid.cells.find(c => c.y === y + 1 && c.x === x) : null; 
}

function previousCellDown(grid: IGrid, cell: IGridCell): IGridCell {
    const x = cell.x;
    const y = cell.y;

    return y > 0 ? grid.cells.find(c => c.y === y - 1 && c.x === x) : null; 
}

