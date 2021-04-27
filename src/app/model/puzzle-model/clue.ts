import { v4 as uuid } from "uuid";
import { ClueGroup, CaptionStyle } from '../interfaces';
import { TextChunk } from './clue-text-chunk';
import { ClueValidationWarning, IClue } from '../interfaces';
import { ClueBuffer } from '../../services/parsing/text/clue-buffer';
import { clueLetterCountExpression } from '../../services/parsing/text/types';
import { GridLink } from './grid-link';
import { QuillDelta } from './quill-delta';

export class Clue implements IClue {
    public readonly id: string;
    public readonly group: ClueGroup;
    public readonly caption: string;        // "1 across, 2 down"
    public readonly text: string;           // "How to train a dragon (5, 4)"
    public readonly letterCount: string;    // "(5, 4)"
    public readonly answers: Array<string>;
    public readonly solution: string;
    public readonly annotation: string;
    public readonly redirect: string;
    public readonly format: string;
    public readonly comment: QuillDelta;
    public readonly highlight: boolean;
    public readonly link: GridLink;
    //public readonly entries: ReadonlyArray<GridEntry>;
    public readonly chunks: Array<TextChunk>;
    public readonly warnings: Array<ClueValidationWarning>;

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

        if (typeof data.redirect === "string") {
            this.redirect = data.redirect;
        } else {
            this.redirect = null;
        }

        if (data.link) {
            this.link = new GridLink(data.link);
        } else {
            // backward compatibility 17/03/2020
            this.link = new GridLink({
                warning: null,
                entries: [],
            });
        }

        // let entries: GridEntry[] = [];
        // data.entries.forEach(entry => entries.push(new GridEntry(entry)));
        // this.link.entries = entries;

        let chunks: TextChunk[] = [];
        data.chunks.forEach(chunk => chunks.push(new TextChunk(chunk)));
        this.chunks = chunks;

        let warnings: ClueValidationWarning[] = [];
        if (data.warnings) {
            data.warnings.forEach(warning => warnings.push(warning));
        }
        this.warnings = warnings;
    }

    // public getDisplayCaption(captionStyle: CaptionStyle) {
    //     let result = "";

    //     if (captionStyle === "numbered") {
    //         result = this.caption;
    //         let exp = new RegExp(String.raw`(across|down)`, "i");

    //         if (!exp.test(this.caption)) {
    //             result += " " + this.group;
    //         }
        
    //     } else if (captionStyle === "alphabetical") {
    //         result = this.caption;
    //     }

    //     return result;
    // }

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

        const expression = String.raw`^(?<clue>.*)` + clueLetterCountExpression;

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
            const exp = new RegExp(String.raw`^\s*\d\s+words\s*$`, "i");
            if (!exp.test(group)) {

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
            const exp = new RegExp(String.raw`\d`);
            if (exp.test(text)) {
                let len = parseInt(text);
                result += ",".repeat(len);
            } else if (text.trim()) {
                result += text.trim();
            }
        }

        return result;
    }

    public static makeClue(caption: string, text: string, letterCount: string, group: ClueGroup, clueId?: string): Clue {
        return new Clue({
            id: clueId || uuid(),
            group,
            caption,
            text,
            letterCount,
            answers: [""],
            solution: "",
            annotation: null,
            redirect: null,
            format: Clue.getAnswerFormat(letterCount),
            comment: new QuillDelta(),
            highlight: false,
            entries: [],
            warnings: [],
            chunks: [
                {
                    text,
                    isDefinition: false,
                }
            ],
        });
    }

    // public static makeClueFromBuffer(buffer: ClueBuffer, group: ClueGroup, clueId?: string): Clue {
    //     return new Clue({
    //         id: clueId || uuid(),
    //         group,
    //         caption: buffer.caption,
    //         text: buffer.clue,
    //         letterCount: buffer.letterCount,
    //         answers: [""],
    //         solution: "",
    //         annotation: null,
    //         redirect: null,
    //         format: Clue.getAnswerFormat(buffer.letterCount),
    //         comment: new QuillDelta(),
    //         highlight: false,
    //         entries: [],
    //         warnings: [],
    //         chunks: [
    //             {
    //                 text: buffer.clue,
    //                 isDefinition: false,
    //             }
    //         ],
    //     });
    // }

    public toMutable(): IClue {
        return JSON.parse(JSON.stringify(this));
    }

    public static isRedirect(text: string): boolean {
        return new RegExp("^see\\s+\\d+(\\d+|across|down|,|\\s+)*$", "i").test(text);
    }
}