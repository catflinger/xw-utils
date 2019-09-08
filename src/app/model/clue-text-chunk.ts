export interface ITextChunk {
    text: string;
    isDefinition: boolean;
}

export class TextChunk implements ITextChunk {
    public readonly text: string;
    public readonly isDefinition: boolean;

    constructor(data) {
        this.text = data.text;
        this.isDefinition = data.isDefinition;
    }
}