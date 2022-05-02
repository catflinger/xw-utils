import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle, Layouts } from '../../model/interfaces';
import { Spacing } from 'src/app/model/interfaces';

export type PublishOptionsUpdate = { 
    includeGrid?: boolean; 
    layout?: Layouts; 
    spacing?: Spacing;
    showClueGroups?: boolean;
    showClueCaptions?: boolean;
    useThemeDefaults?: boolean;

};

export class UpdatePublsihOptions implements IPuzzleModifier {
    constructor(private options: PublishOptionsUpdate) { }

    exec(puzzle: IPuzzle) {
        if (!this.options) {
            return;
        }

        if (typeof this.options.useThemeDefaults !== "undefined") {
            puzzle.publishOptions.useThemeDefaults = !!this.options.useThemeDefaults;
        }

        if (typeof this.options.includeGrid !== "undefined") {
            puzzle.publishOptions.includeGrid = !!this.options.includeGrid;
        }

        if (typeof this.options.layout !== "undefined" && this.options.layout !== null) {
            puzzle.publishOptions.layout = this.options.layout;
        }

        if (typeof this.options.spacing !== "undefined" && this.options.spacing !== null) {
            puzzle.publishOptions.spacing = this.options.spacing;
        }

        if (typeof this.options.showClueCaptions !== "undefined") {
            puzzle.publishOptions.showClueCaptions = !!this.options.showClueCaptions;
        }

        if (typeof this.options.showClueGroups !== "undefined") {
            puzzle.publishOptions.showClueGroups = !!this.options.showClueGroups;
        }
    }
}