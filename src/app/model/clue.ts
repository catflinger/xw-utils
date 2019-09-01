import { ClueGroup } from './puzzle';
import { GridEntry, IGridEntry } from './grid-entry';

export interface IClue {
    id: string;
    group: ClueGroup;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon (5, 4)"
    letterCount: string;    // "(5, 4)"
    answer: string;
    definition: string;
    format: string;
    comment: string;
    highlight: boolean;
    entries: readonly IGridEntry[];
}

export class Clue implements IClue {
    public readonly id: string;
    public readonly group: ClueGroup;
    public readonly caption: string;        // "1 across, 2 down"
    public readonly text: string;           // "How to train a dragon (5, 4)"
    public readonly letterCount: string;    // "(5, 4)"
    public readonly answer: string;
    public readonly definition: string;
    public readonly format: string;
    public readonly comment: string;
    public readonly highlight: boolean;
    public readonly entries: readonly GridEntry[];

    constructor(data: any) {
        this.id = data.id;
        this.group = data.group;
        this.caption = data.caption;
        this.text = data.text;
        this.letterCount = data.letterCount;
        this.answer = data.answer;
        this.definition = data.definition;
        this.format = data.format;
        this.comment = data.comment;
        this.highlight = data.highlight;
        
        let entries: GridEntry[] = [];
        data.entries.forEach(entry => entries.push(new GridEntry(entry)));
        this.entries = entries;
    }
}