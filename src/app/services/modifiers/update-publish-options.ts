import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { Layouts } from 'src/app/model/interfaces';

export type PublishOptionsUpdate = { includeGrid?: boolean; layout?: Layouts};

export class UpdatePublsihOptions implements IPuzzleModifier {
    constructor(private options: PublishOptionsUpdate) { }

    exec(puzzle: PuzzleM) {
        if (!this.options) {
            return;
        }

        if (typeof this.options.includeGrid !== "undefined" && this.options.includeGrid !== null) {
            puzzle.publishOptions.includeGrid = this.options.includeGrid;
        }

        if (typeof this.options.layout !== "undefined" && this.options.layout !== null) {
            puzzle.publishOptions.layout = this.options.layout;
        }

    }
}