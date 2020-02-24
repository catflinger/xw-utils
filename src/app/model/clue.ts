import { v4 as uuid } from "uuid";
import { ClueGroup, QuillDelta } from './interfaces';
import { GridEntry } from './grid-entry';
import { TextChunk } from './clue-text-chunk';
import { ClueValidationWarning, IClue } from './interfaces';
import { GridReference } from './grid-reference';
import { ClueM } from '../services/modifiers/mutable-model/clue-m';
import { ClueBuffer } from '../services/parsing/text/clue-buffer';

export class Clue implements IClue {
    public readonly id: string;
    public readonly group: ClueGroup;
    public readonly caption: string;        // "1 across, 2 down"
    public readonly text: string;           // "How to train a dragon (5, 4)"
    public readonly letterCount: string;    // "(5, 4)"
    public readonly answers: ReadonlyArray<string>;
    //public readonly answerAlt: string;
    public readonly solution: string;
    public readonly annotation: string;
    public readonly redirect: boolean;
    public readonly format: string;
    public readonly comment: QuillDelta;
    public readonly highlight: boolean;
    public readonly entries: ReadonlyArray<GridEntry>;
    public readonly chunks: ReadonlyArray<TextChunk>;
    public readonly warnings: ReadonlyArray<ClueValidationWarning>; 
    public readonly gridRefs: ReadonlyArray<GridReference>; 

    constructor(data: any) {
        this.id = data.id;
        this.caption = data.caption;
        this.text = data.text;
        this.letterCount = data.letterCount;
        this.solution = data.solution;
        this.annotation = data.annotation;
        this.format = data.format;
        this.comment = data.comment;
        this.highlight = data.highlight;

        if (data.answers) {
            let answers = [];
            data.answers.forEach(a => answers.push(a));
            this.answers = answers;
        } else if (data.answer) {
            this.answers = [data.answer];
        } else {
            this.answers = [""];
        };

        if (typeof data.group === "string" && (data.group === "across" || data.group === "down")) {
            this.group = data.group;
        } else {
            throw "unrecognised clue group when reading clue data";
        }

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

        let refs: GridReference[] = [];
        if (data.gridRefs && Array.isArray(data.gridRefs)) {
            data.gridRefs.forEach(ref => refs.push(new GridReference(ref.clueNumber, ref.clueGroup)));
        }
        this.gridRefs = refs;

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

    public static validateAnnotation(answer: string, comment: QuillDelta, chunks: readonly TextChunk[]): ClueValidationWarning[] {
        let warnings: ClueValidationWarning[] = [];

        if (!answer || answer.trim().length === 0) {
            warnings.push("missing answer");
        }

        let commentOK = false;

        if (comment && comment.ops && Array.isArray(comment.ops)) {
            let text = "";

            comment.ops.forEach(op => {
                if (op.insert) {
                    text += op.insert;
                }
            });
            commentOK = text.trim().length > 0;
        }

        if (!commentOK) {
            warnings.push("missing comment");
        }


        let definitionCount = 0;
        chunks.forEach(chunk => {
            if (chunk.isDefinition) {
                definitionCount++;
            }
        })

        if (definitionCount === 0) {
            warnings.push("missing definition");
        }

        return warnings;
    }

    public static getLetterCount(text: string): string {
        let result = "";

        const expression = String.raw`^(?<clue>.*)(?<letterCount>\([0-9-words, ]+?\)\s*$)`;

        const regExp = new RegExp(expression);
        const match = regExp.exec(text);

        if (match && match.groups["letterCount"]) {
           
            result = match.groups["letterCount"].trim();
            result = result.substring(1, result.length - 1);
        }

        return result.trim();
    }


    public static getAnswerFormat(letterCount: string): string {
        let result = "";
        let groups = letterCount.split(",");

        groups.forEach((group, index ) => {

            // ignore barred grid "2 words" annotations
            if (!/^\s*\d\s+words\s*$/i.test(group)) {

                if (index > 0) {
                    result += "/";
                }
                result += this.parseGroup(group);

            }
        });

        return result;
    }

    private static parseGroup(group): string {
        let result = "";
        let match = null;

        let exp = /\d+|[^a-z0-9]/gi;

        while(match = exp.exec(group.trim())) {
            let text: string = match[0];

            if (/\d/.test(text)) {
                let len = parseInt(text);
                result += ",".repeat(len);
            } else if (text.trim()) {
                result += text.trim();
            }
        }

        return result;
    }

    public static makeClue(buffer: ClueBuffer, group: ClueGroup): Clue {
        return new Clue({
            id: uuid(),
            group,
            caption: buffer.caption,
            text: buffer.clue,
            letterCount: buffer.letterCount,
            answer: "",
            solution: "",
            annotation: null,
            redirect: false,
            format: Clue.getAnswerFormat(buffer.letterCount),
            comment: new QuillDelta(),
            highlight: false,
            entries: [],
            warnings: [],
            gridRefs: buffer.gridRefs,
            chunks: [
                {
                    text: buffer.clue,
                    isDefinition: false,
                }
            ],
        });
    }

    public toMutable(): ClueM {
        return JSON.parse(JSON.stringify(this));
    }

}