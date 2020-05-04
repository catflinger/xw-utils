import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Direction, WritingDirection, GridNavigation } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { SelectCellsForEdit } from 'src/app//modifiers/grid-modifiers/select-cells-for-edit';
import { MakeCellEditable } from 'src/app//modifiers/grid-modifiers/make-cell-editable';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { GridEditor } from './grid-editor';

export class GridCellEditor extends GridEditor {
     constructor() {
        super();
    }

    public startEdit(puzzle: Puzzle, entryCell: GridCell): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];

        result.push(new Clear());
        result.push(new SelectCellsForEdit([entryCell]));
        result.push(new MakeCellEditable(entryCell.id));
        return result;
    }

    public onGridText(puzzle: Puzzle, text: string, writingDirection: WritingDirection): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);

        if (context.editCell) {
            result.push(new UpdateCell(context.editCell.id, { content: text.toUpperCase() }));
        }
        result.push(new Clear());

        return result;
    }

    public onGridNavigation(puzzle: Puzzle, navigation: GridNavigation, position?: { x: number, y: number }): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);

        result.push(new Clear());
        let next: GridCell = null;

        if (navigation === "absolute") {
            next = puzzle.grid.cellAt(position.x, position.y);
        } else {
            if (context.editCell) {
                next = this.getNextEditableCell(puzzle, context.editCell, navigation);
            }
        }

        if (next) {
            result.push(new SelectCellsForEdit([next]));
            result.push(new MakeCellEditable(next.id));
        }

        return result;
    }
    
}
