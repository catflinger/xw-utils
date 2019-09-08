import { TextChunk } from '../model/clue-text-chunk';

export class ClueUpdate {

    constructor(    
        public answer: string,
        public comment: string,
        public chunks: TextChunk[],
        ) { }
}