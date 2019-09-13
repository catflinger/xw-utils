import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdatePublsihOptionIncludeGrid implements IPuzzleModifier {
    constructor(private includeGid: boolean) { }

    exec(puzzle: PuzzleM) {
        puzzle.publishOptions.includeGrid = this.includeGid;
    }
}