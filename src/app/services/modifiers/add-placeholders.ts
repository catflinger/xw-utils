import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { DeltaInsertOp, InsertDataCustom } from 'quill-delta-to-html';

export class AddPlaceholders implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            puzzle.notes.header = {
                ops: [ { "insert": "enter your introduction here" } ]
            };
            puzzle.notes.body = {
                ops: [ { "insert": "enter your further comments here"} ]
            };
            puzzle.clues.forEach(clue => clue.warnings = [ "missing answer", "missing comment", "missing definition"]);
        }
    }
}