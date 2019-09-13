import { IPuzzleAnnotation } from './interfaces';
import { DeltaOperation } from 'quill';

export class PuzzleAnnotation implements IPuzzleAnnotation {
    public readonly header:  DeltaOperation[];
    public readonly body:  DeltaOperation[];
    public readonly footer:  DeltaOperation[];

    constructor(data: any) {
        this.header = data.header;
        this.body = data.body;
        this.footer = data.footer;
    }
}