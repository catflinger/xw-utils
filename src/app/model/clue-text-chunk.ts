import { ITextChunk } from '../model3/interfaces';

export class TextChunk implements ITextChunk {
    public readonly text: string;
    public readonly isDefinition: boolean;

    constructor(data) {
        this.text = data.text;
        this.isDefinition = data.isDefinition;
    }
}