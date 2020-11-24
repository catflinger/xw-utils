import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { Clue } from 'src/app/model/puzzle-model/clue';
import escape from "escape-html";
import { TextChunk } from 'src/app/model/puzzle-model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { TextStyle } from 'src/app/model/puzzle-model/text-style';
import { ContentGenerator } from '../common';
import { QuillDelta } from 'src/app/model/puzzle-model/quill-delta';

const marginSizes = {
    small: "2px",
    medium: "5px",
    large: "8px",
}

const prefix = "fts";

export class ContentGeneratorListLayout implements ContentGenerator {
    private marginSize: string = "3px";

    // IMPORTANT!
    // review this component for XSS vunerabilities

    constructor() {
    }

    public getContent(puzzle: Puzzle, gridUrl: string): string {
        this.marginSize = marginSizes[puzzle.publishOptions.spacing];

        const markup =  `
        <div>
            <div class="entry-title">
                ${this.writeQuillDelta(puzzle.notes.header)}
            </div>

            <!-- MORE -->

            <div>
                ${this.writeQuillDelta(puzzle.notes.body)}
            </div>

            <div>
                ${this.writeGridUrl(gridUrl)}
            </div>

            <div class="fts-across-down">
                ACROSS
            </div>
            
            <div>
                ${this.writeClues(puzzle.clues.filter(c => c.group === "across"), puzzle.publishOptions)}
            </div>

            <div class="fts-across-down">
                DOWN
            </div>
            
            <div>
            ${this.writeClues(puzzle.clues.filter(c => c.group === "down"), puzzle.publishOptions)}
            </div>

            <div class="fts-footer">
                ${this.writeQuillDelta(puzzle.notes.footer)}
            </div>
        </div>
        `;

        return markup;
    }

    private writeClueItem(content: string, publishOptions: PublishOptions) {
        const markup = publishOptions.useDefaults ?
         `
        <div class="${prefix}-clue-item-${this.marginSize}">
            ${content}
        </div>
        ` :
        `
        <div style="margin-top:${this.marginSize}">
            ${content}
        </div>
        `;

        return markup;
    }

    private writeClue(clue: Clue, publishOptions: PublishOptions) {
        let markup = this.writeClueItem(
            this.writeText(clue.caption, publishOptions.useDefaults, publishOptions.clueStyle) + 
            this.writeText(". ", publishOptions.useDefaults, publishOptions.clueStyle) + 
            this.writeClueText(clue.chunks, publishOptions),
            publishOptions);

        if (publishOptions.textCols.length === 1) {
            let text = clue.answers[0] || "";
            markup += this.writeClueItem(
                this.writeText(text, publishOptions.useDefaults, publishOptions.answerStyle),
                publishOptions);
        } else {
            publishOptions.textCols.forEach((col, index) => {
                let caption = col.caption || "";
                let text = clue.answers[index] || "";
                markup += this.writeClueItem(
                    caption + this.writeText(text, publishOptions.useDefaults, publishOptions.answerStyle),
                    publishOptions);
            });
        }        
        markup += this.writeClueItem(
            this.writeQuillDelta(clue.comment),
            publishOptions);

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

    private     writeClues(clues: Clue[], publishOptions): string {
        let markup = "";
        clues.forEach(clue => markup += this.writeClue(clue, publishOptions));
        return markup;
    }

    private writeText(text: string, useDefaults: boolean, textStyle?: TextStyle) {
        let markup = "";

        if (textStyle) {
            markup = useDefaults ?
             `<span class="${prefix}-${textStyle.name}">${escape(text)}</span>` :
             `<span style="${textStyle.toCssStyleString()}">${escape(text)}</span>`;
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

                markup += publishOptions.useDefaults ? 
                `<span class="${prefix}-${textStyle.name}">${chunk.text}</span>` :
                `<span style="${textStyle.toCssStyleString()}">${chunk.text}</span>`;
        });

        return markup;
    }
}