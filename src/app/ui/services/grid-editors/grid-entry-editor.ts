import { WritingDirection, GridNavigation, Direction } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { GridEditor, EditContext } from './grid-editor';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { SelectCellsForEdit } from 'src/app//modifiers/grid-modifiers/select-cells-for-edit';
import { MakeCellEditable } from 'src/app//modifiers/grid-modifiers/make-cell-editable';

export class GridEntryEditor extends GridEditor {

    constructor() {
        super();
    }

    public startEdit(puzzle: Puzzle, entryCell: GridCell): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];

        result.push(new Clear());
        let entry = puzzle.grid.getGridEntryForCell(entryCell.id);

        if (entry.length > 0) {
            result.push(new SelectCellsForEdit(entry));

            if (entry[0].content && entry[0].content.trim().length > 0) {
                result.push(new MakeCellEditable(entryCell.id));
            } else {
                result.push(new MakeCellEditable(entry[0].id));
            }
        }

        return result;
    }

    public onGridText(puzzle: Puzzle, text: string, writingDirection: WritingDirection): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);

        // update the text
        result.push(new UpdateCell(context.editCell.id, { content: text.toUpperCase() }));

        this.makeNextCellEditable(puzzle, context, writingDirection, result);

        return result;
    };

    public onGridNavigation(puzzle: Puzzle, navigation: GridNavigation, position?: { x: number, y: number }): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);
        let writingDirection: WritingDirection;
        let ctx: EditContext;

        if ( this.isParallelMotion(context.entryDirection, navigation) || navigation ==="absolute") {

            switch (navigation) {
                case "right":
                case "down":
                    ctx = context;
                    writingDirection = "forward";
                    break;
                
                case "left":
                case "up":
                    ctx = context;
                    writingDirection = "backward";
                    break;
                
                case "absolute":
                    if (position) {
                        let cell = puzzle.grid.cellAt(position.x, position.y);

                        if (cell.highlight) {
                            let idx = context.cells.findIndex(c => c.id == cell.id);

                            ctx = new EditContext(context.cells, idx, context.entryDirection);
                            writingDirection = "static";
                        }
                    }
                    break;

                default:
                    break;
            }

            if (writingDirection) {
                this.makeNextCellEditable(puzzle, ctx, writingDirection, result);
            } else {
                result.push(new Clear());
            }

        } else {
            result.push(new Clear());
        }


        return result;
    }

    private isParallelMotion(direction: Direction, navigation: GridNavigation) {
        if (direction === "across") {
            return navigation === "left" || navigation == "right";
        } else {
            return navigation === "up" || navigation == "down";
        }
    }

    private makeNextCellEditable(puzzle: Puzzle, context: EditContext, writingDirection: WritingDirection, result: IPuzzleModifier[]) {
        let nextIndex: number;

        switch (writingDirection) {
            case "forward":
                nextIndex = context.editIndex + 1;
                break;
            
            case "backward":
                nextIndex = context.editIndex - 1;
                break;
            
            case "static":
            default:
                nextIndex = context.editIndex;
                break;
        }

        if (nextIndex < 0) {
            this.onUnderflow(puzzle, context, result);
        } else if (nextIndex >= context.cells.length) {
            this.onOverflow(puzzle, context, result);
        } else {
            result.push(new MakeCellEditable(context.cells[nextIndex].id));
        }
    }

    protected onUnderflow(puzzle: Puzzle, context: EditContext, result: IPuzzleModifier[]) {
        result.push(new Clear());
    }

    protected onOverflow(puzzle: Puzzle, context: EditContext, result: IPuzzleModifier[]) {
        result.push(new Clear());
    }

}