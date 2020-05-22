import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { GridEntryEditor } from './grid-entry-editor';
import { EditContext } from './grid-editor';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';

export class GridEntryEditorFluid extends GridEntryEditor {

    constructor() {
        super();
    }

    protected onUnderflow(puzzle: Puzzle, context: EditContext, result: IPuzzleModifier[]) {

// TO DO: implement this

        result.push(new Clear());
    }

    protected onOverflow(puzzle: Puzzle, context: EditContext, result: IPuzzleModifier[]) {

// TO DO: implement this

    result.push(new Clear());
    }

}