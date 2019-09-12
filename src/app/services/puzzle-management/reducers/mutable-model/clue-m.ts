import { IClue, ClueGroup, IGridEntry, ClueValidationWarning } from 'src/app/model/interfaces';
import { TextChunkM } from './text-chunk-m';
import { GridEntryM } from './grid-entry-m';

export class ClueM implements IClue {
    id: string;
    group: ClueGroup;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon (5, 4)"
    letterCount: string;    // "(5, 4)"
    answer: string;
    format: string;
    comment: string;
    highlight: boolean;
    entries: GridEntryM[];
    chunks: TextChunkM[];
    warnings: ClueValidationWarning[]; 
}
