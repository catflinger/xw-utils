import { IReducer } from './reducer';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdatePreamble implements IReducer {
    constructor(
        private title: string,
        private header: string, 
        private body: string) { }

    exec(puzzle: PuzzleM) {
        puzzle.info.title = this.title ? this.title : "untitled";
        puzzle.notes.header = this.header;
        puzzle.notes.body = this.body;
    }
}