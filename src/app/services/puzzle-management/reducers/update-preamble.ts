import { IReducer } from './reducer';
import { PuzzleM } from './mutable-model/puzzle-m';

export class UpdatePreamble implements IReducer {
    constructor(
        private header: string, 
        private body: string) { }

    exec(puzzle: PuzzleM) {
        puzzle.notes.header = this.header;
        puzzle.notes.body = this.body;
    }
}