import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Direction, WritingDirection, GridNavigation } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { JsonPipe } from '@angular/common';

export class EditContext { 
    constructor (
        public readonly cells: ReadonlyArray<GridCell>,
        public readonly editIndex: number, 
        public readonly entryDirection: Direction,
    ) {}

    public get editCell(): GridCell {
        return this.cells[this.editIndex];
    }
};

export abstract class GridEditor {
    
    constructor() {}

    public abstract startEdit(puzzle: Puzzle, entryCell: GridCell): IPuzzleModifier[];
    public abstract onGridText(puzzle: Puzzle, text: string, writingDirection: WritingDirection): IPuzzleModifier[];
    public abstract onGridNavigation(puzzle: Puzzle, navigation: GridNavigation, position?: { x: number, y: number }): IPuzzleModifier[];
    
    protected getEditContext(puzzle: Puzzle): EditContext {
        let cells: GridCell[] = [];
        let entryDirection: Direction = "across";
        let editIndex = -1;

        let nav = puzzle.grid.getNavigator(puzzle.grid.cellAt(0, 0).id, "right");

        for (let item = nav.next(); !item.done; item = nav.next()) {
            if (item.value.highlight) {
                cells.push(item.value);
            }
        }

        if (cells.length > 1) {
            if (cells[0].x === cells[1].x) {
                entryDirection = "down";
            }
        }

        editIndex = cells.findIndex(c => c.edit);

        return new EditContext(cells, editIndex, entryDirection);
    }

    protected getNextEditableCell(puzzle: Puzzle, start: GridCell, orientation: GridNavigation): GridCell {
        let result: GridCell = null;

        if (start) {
            let navigator = puzzle.grid.getNavigator(start.id, orientation);
            
            //skip the start cell
            navigator.next();
            
            for (let next = navigator.next(); !next.done; next = navigator.next()) {
                if (next.value.id === start.id) {
                    break;
                }
                if (next.value.light) {
                    result = next.value;
                    break;
                }
            }
        }
        return result;
    }

}
