import { IPuzzleModifier } from '../puzzle-modifier';
import { IPuzzle } from '../../model/interfaces';
import { QuillDelta } from 'src/app/model/puzzle-model/quill-delta';

export class UpdatePreamble implements IPuzzleModifier {
    constructor(
        private title:  string,
        private header:  QuillDelta, 
        private body:  QuillDelta) { }

    exec(puzzle: IPuzzle) {
        puzzle.info.title = this.title ? this.title : "untitled";
        puzzle.notes.header = this.header;
        puzzle.notes.body = this.body;
    }
}