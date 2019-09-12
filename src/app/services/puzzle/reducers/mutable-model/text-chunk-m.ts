import { ITextChunk } from 'src/app/model/interfaces';

export class TextChunkM implements ITextChunk {
    text: string;
    isDefinition: boolean;
}
