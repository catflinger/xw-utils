import { ClueGroup, QuillDelta } from './interfaces';
import { GridEntry } from './grid-entry';
import { TextChunk } from './clue-text-chunk';
import { ClueValidationWarning, IClue } from './interfaces';

export class Clue implements IClue {
    public readonly id: string;
    public readonly group: ClueGroup;
    public readonly caption: string;        // "1 across, 2 down"
    public readonly text: string;           // "How to train a dragon (5, 4)"
    public readonly letterCount: string;    // "(5, 4)"
    public readonly answer: string;
    public readonly solution: string;
    public readonly annotation: string;
    public readonly redirect: boolean;
    public readonly format: string;
    public readonly comment: QuillDelta;
    public readonly highlight: boolean;
    public readonly entries: readonly GridEntry[];
    public readonly chunks: readonly TextChunk[];
    public readonly warnings: readonly ClueValidationWarning[]; 

    constructor(data: any) {
        this.id = data.id;
        this.group = data.group;
        this.caption = data.caption;
        this.text = data.text;
        this.letterCount = data.letterCount;
        this.answer = data.answer;
        this.solution = data.solution;
        this.annotation = data.annotation;
        this.format = data.format;
        this.comment = data.comment;
        this.highlight = data.highlight;

        if (typeof data.redirect === "boolean") {
            this.redirect = data.redirect;
        } else if (typeof data.text === "string" && data.text.length > 0) {
            this.redirect = new RegExp("^see\\s+\\d+(\\d+|across|down|,|\\s+)*$", "i").test(data.text);
        } else {
            this.redirect = false;
        }

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

    public get lengthAvailable(): number {
        let count = 0;
        this.entries.forEach(entry => entry.cellIds.forEach(c => count = count + 1 ));
        return count;
    }
}