import { ITextChunk } from 'src/app/model/interfaces';

export abstract class TextChunkM implements ITextChunk {
    public abstract text: string;
    public abstract isDefinition: boolean;
}
