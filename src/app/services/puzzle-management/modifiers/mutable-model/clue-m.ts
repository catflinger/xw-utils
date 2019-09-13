import { IClue, ClueGroup, IGridEntry, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunkM } from './text-chunk-m';
import { GridEntryM } from './grid-entry-m';

export abstract class ClueM implements IClue {
    public abstract id: string;
    public abstract group: ClueGroup;
    public abstract caption: string;
    public abstract text: string;
    public abstract letterCount: string;
    public abstract answer: string;
    public abstract format: string;
    public abstract comment: string;
    public abstract highlight: boolean;
    public abstract entries: GridEntryM[];
    public abstract chunks: TextChunkM[];
    public abstract warnings: ClueValidationWarning[]; 
}
