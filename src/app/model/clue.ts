import { ClueGroup } from './puzzle';
import { GridEntry, IGridEntry } from './grid-entry';
import { TextChunk } from './clue-text-chunk';

export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";

export interface IClue {
    id: string;
    group: ClueGroup;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon (5, 4)"
    letterCount: string;    // "(5, 4)"
    answer: string;
    format: string;
    comment: string;
    highlight: boolean;
    entries: readonly IGridEntry[];
    chunks: readonly TextChunk[];
    warnings: ClueValidationWarning[]; 
}

export class Clue implements IClue {
    public readonly id: string;
    public readonly group: ClueGroup;
    public readonly caption: string;        // "1 across, 2 down"
    public readonly text: string;           // "How to train a dragon (5, 4)"
    public readonly letterCount: string;    // "(5, 4)"
    public readonly answer: string;
    public readonly format: string;
    public readonly comment: string;
    public readonly highlight: boolean;
    public readonly entries: readonly GridEntry[];
    public readonly chunks: readonly TextChunk[];
    public readonly warnings: ClueValidationWarning[]; 

    constructor(data: any) {
        this.id = data.id;
        this.group = data.group;
        this.caption = data.caption;
        this.text = data.text;
        this.letterCount = data.letterCount;
        this.answer = data.answer;
        this.format = data.format;
        this.comment = data.comment;
        this.highlight = data.highlight;
        
        let entries: GridEntry[] = [];
        data.entries.forEach(entry => entries.push(new GridEntry(entry)));
        this.entries = entries;

        let chunks: TextChunk[] = [];
        data.chunks.forEach(chunk => chunks.push(new TextChunk(chunk)));
        this.chunks = chunks;

        let warnings: ClueValidationWarning[] = [];
        if (data.warnings) {
            data.warnings.forEach(warning => warnings.push(warning));
        }
        this.warnings = warnings;
    }
}