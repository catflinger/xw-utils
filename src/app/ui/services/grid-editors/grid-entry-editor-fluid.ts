import { WritingDirection, GridNavigation, Direction } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle';
import { IPuzzleModifier } from 'src/app/services/modifiers/puzzle-modifier';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { GridCell } from 'src/app/model/grid-cell';
import { GridEditor } from './grid-editor';

export class GridEntryEditorFluid extends GridEditor {

    constructor() {
        super();
    }

    public startEdit(puzzle: Puzzle, entryCell: GridCell): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        return result;
    }

    public onGridText(puzzle: Puzzle, text: string, writingDirection: WritingDirection): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        let context = this.getEditContext(puzzle);

        // update the text
        result.push(new UpdateCell(context.editCell.id, { content: text.toUpperCase() }));

        // decide what to do next

        return result;
    };

    public onGridNavigation(puzzle: Puzzle, navigation: GridNavigation, position?: { x: number, y: number }): IPuzzleModifier[] {
        let result: IPuzzleModifier[] = [];
        return result;
    }

    private isParallelMotion(direction: Direction, navigation: GridNavigation) {
        if (direction === "across") {
            return navigation === "left" || navigation == "right";
        } else {
            return navigation === "up" || navigation == "down";
        }
    }

}