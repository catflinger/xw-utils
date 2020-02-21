import { IClue, ClueGroup, ClueValidationWarning, QuillDelta } from 'src/app/model/interfaces';
import { TextChunkM } from './text-chunk-m';
import { GridEntryM } from './grid-entry-m';
import { GridReference } from 'src/app/model/grid-reference';

export abstract class ClueM implements IClue {
    public abstract id: string;
    public abstract group: ClueGroup;
    public abstract caption: string;
    public abstract text: string;
    public abstract letterCount: string;
    public abstract answer: string;
    public abstract answerAlt: string;
    public abstract solution: string;
    public abstract annotation: string;
    public abstract redirect: boolean;
    public abstract format: string;
    public abstract comment: QuillDelta;
    public abstract highlight: boolean;
    public abstract entries: GridEntryM[];
    public abstract chunks: TextChunkM[];
    public abstract warnings: ClueValidationWarning[];
    public abstract gridRefs: GridReference[];
}

