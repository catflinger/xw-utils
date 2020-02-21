import { Puzzle } from 'src/app/model/puzzle';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { QuillDelta } from 'src/app/model/interfaces';
import { Clue } from 'src/app/model/clue';
import escape from "escape-html";
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/publish-options';
import { TextStyle } from 'src/app/model/text-style';
import { ContentGenerator } from '../common';

const marginSizes = {
    small: "2px",
    medium: "5px",
    large: "8px",
}

export class ContentGeneratorListLayout implements ContentGenerator {
    private marginSize: string = "3px";

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities

    constructor() {
    }

    public getContent(puzzle: Puzzle, gridUrl: string): string {
        this.marginSize = marginSizes[puzzle.publishOptions.spacing];

        const markup =  `
        <div>
            <div>
                ${this.writeQuillDelta(puzzle.notes.header)}
                <!-- MORE -->
                ${this.writeQuillDelta(puzzle.notes.body)}
            </div>

            <div>
                ${this.writeGridUrl(gridUrl)}
            </div>

            <div>
                ACROSS
            </div>
            
            <div>
                ${this.writeClues(puzzle.clues.filter(c => c.group === "across"), puzzle.publishOptions)}
            </div>

            <div>
                DOWN
            </div>
            
            <div>
            ${this.writeClues(puzzle.clues.filter(c => c.group === "down"), puzzle.publishOptions)}
            </div>

            <div>
                ${this.writeQuillDelta(puzzle.notes.footer)}
            </div>
        </div>
        `;

        return markup;
    }

    private writeClueItem(content: string) {
        const markup = `
        <div style="margin-top:${this.marginSize}">
            ${content}
        </div>
        `;
        return markup;
    }

    private writeClue(clue: Clue, publishOptions: PublishOptions) {
        let markup = this.writeClueItem(this.writeText(clue.caption, publishOptions.clueStyle) + this.writeClueText(clue.chunks, publishOptions));
        if (publishOptions.modifyAnswers && clue.answerAlt) {
            markup += this.writeClueItem("Answer: " + this.writeText(clue.answerAlt, publishOptions.answerStyle));
        }
        let caption = publishOptions.modifyAnswers ? "Grid entry: " : "";
        markup += this.writeClueItem(caption + this.writeText(clue.answer, publishOptions.answerStyle));
        markup += this.writeClueItem(this.writeQuillDelta(clue.comment));

        return markup;
    }

    private writeGridUrl(url: string) {
        let markup = "";

        if (url) {
            markup = `
            <img src="${url}" alt="image of grid">
            `;
        }

        return markup;
    }

    private writeClues(clues: Clue[], publishOptions): string {
        let markup = "";
        clues.forEach(clue => markup += this.writeClue(clue, publishOptions));
        return markup;
    }

    private writeText(text: string, textStyle?: TextStyle) {
        let markup = "";

        if (textStyle) {
            markup = `<span style="${textStyle.toCssStyleString()}">${escape(text)}</span>`;
        } else {
            markup = escape(text);
        }
        return markup;
    }

    private writeQuillDelta(delta: QuillDelta) {
        let markup = "";

        if (delta && delta.ops && delta.ops.length) {
            const converter = new QuillDeltaToHtmlConverter(
                delta.ops,
                { inlineStyles: true });

            markup = converter.convert();
        }

        return markup;
    }

    private writeClueText(chunks: readonly TextChunk[], publishOptions: PublishOptions): string {
        let markup = "";

        chunks.forEach(chunk => {
            let textStyle = chunk.isDefinition ?
                publishOptions.definitionStyle :
                publishOptions.clueStyle;

                markup += `<span style="${textStyle.toCssStyleString()}">${chunk.text}</span>`;
        });

        return markup;
    }
}