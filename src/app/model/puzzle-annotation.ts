import { IPuzzleAnnotation, QuillDelta } from './interfaces';

export class PuzzleAnnotation implements IPuzzleAnnotation {
    public readonly header:  QuillDelta;
    public readonly body:  QuillDelta;
    public readonly footer:  QuillDelta;

    constructor(data: any) {
        this.header = data.header;
        this.body = data.body;
        this.footer = data.footer;
    }
}