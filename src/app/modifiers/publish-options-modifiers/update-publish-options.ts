import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { IPuzzle, Layouts } from '../../model/interfaces';
import { Spacing } from 'src/app/model/interfaces';

export type PublishOptionsUpdate = { 
    includeGrid?: boolean; 
    layout?: Layouts; 
    spacing?: Spacing;
    // textStyles?: ReadonlyArray<TextStyle>;
    // textCols?: ReadonlyArray<TextColumn>;
};

export class UpdatePublsihOptions implements IPuzzleModifier {
    constructor(private options: PublishOptionsUpdate) { }

    exec(puzzle: IPuzzle) {
        if (!this.options) {
            return;
        }

        if (typeof this.options.includeGrid !== "undefined" && this.options.includeGrid !== null) {
            puzzle.publishOptions.includeGrid = this.options.includeGrid;
        }

        if (typeof this.options.layout !== "undefined" && this.options.layout !== null) {
            puzzle.publishOptions.layout = this.options.layout;
        }

        if (typeof this.options.spacing !== "undefined" && this.options.spacing !== null) {
            puzzle.publishOptions.spacing = this.options.spacing;
        }

        // if (typeof this.options.textStyles !== "undefined") {
        //     puzzle.publishOptions.textStyles = JSON.parse(JSON.stringify(this.options.textStyles));
        // }

        // if (typeof this.options.textCols !== "undefined") {
        //     puzzle.publishOptions.textCols = JSON.parse(JSON.stringify(this.options.textCols));
        // }

    }
}