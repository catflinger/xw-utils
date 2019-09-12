import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/interfaces';

export class UpdatePreamble implements IReducer {
    constructor(
        private header: string, 
        private body: string) { }

    exec(puzzle: IPuzzle) {
        puzzle.notes.header = this.header;
        puzzle.notes.body = this.body;
    }
}