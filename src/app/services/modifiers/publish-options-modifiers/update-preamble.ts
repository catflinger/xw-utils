import { IPuzzleModifier } from '../puzzle-modifiers/puzzle-modifier';
import { PuzzleM } from '../mutable-model/puzzle-m';
import { QuillDelta } from 'src/app/model/interfaces';

export class UpdatePreamble implements IPuzzleModifier {
    constructor(
        private title:  string,
        private header:  QuillDelta, 
        private body:  QuillDelta) { }

    exec(puzzle: PuzzleM) {
        puzzle.info.title = this.title ? this.title : "untitled";
        puzzle.notes.header = this.header;
        puzzle.notes.body = this.body;
    }
}