import { WritingDirection, GridNavigation } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle';
import { IPuzzleModifier } from 'src/app/services/modifiers/puzzle-modifier';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { SelectCellsForEdit } from 'src/app/services/modifiers/select-cells-for-edit';
import { Clear } from 'src/app/services/modifiers/clear';
import { MakeCellEditable } from 'src/app/services/modifiers/make-cell-editable';
import { GridCellEditor } from './grid-cell-editor';

// SimpleGridEditor highlights and edits one cell at a time
// After text entry the editor alwyas moves on to the next free cell: left-right then top-bottom
export class GridCellEditorFluid extends GridCellEditor {

    constructor() {
        super();
    }

    public onGridText(puzzle: Puzzle, text: string, writingDirection: WritingDirection): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);

        result.push(new Clear());

        if (context.editCell) {
            // update the text
            result.push(new UpdateCell(context.editCell.id, { content: text.toUpperCase() }));

            // decide what to do next
            let next = this.getNextEditableCell(puzzle, context.editCell, "right");

            if (next) {
                result.push(new SelectCellsForEdit([next]));
                result.push(new MakeCellEditable(next.id));
            }
        }

        return result;
    };
}