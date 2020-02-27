import { Puzzle } from 'src/app/model/puzzle';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { QuillDelta } from 'src/app/model/interfaces';
import { Clue } from 'src/app/model/clue';
import escape from "escape-html";
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/publish-options';
import { TextStyle } from 'src/app/model/text-style';
import { ContentGenerator } from '../common';

const paddingSizes = {
    small: "1px",
    medium: "3px",
    large: "5px",
}

export class ContentGeneratorTableLayout implements ContentGenerator {
    private buffer: string = "";
    private tdPadding = "3px";

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities

    // TO DO: rewrite this using the neater back-quote syntax, as used in ContentGeneratorListLayout

    constructor() {
    }

    public getContent(puzzle: Puzzle, gridUrl: string): string {
        this.tdPadding = paddingSizes[puzzle.publishOptions.spacing];

        this.addHtml("<div>").newline();
        this.addQuillDelta(puzzle.notes.header).newline();
        this.addHtml("<!-- MORE -->").newline();
        this.addQuillDelta(puzzle.notes.body).newline();

        if (gridUrl) {
            this.addHtml("<div>").newline();
            this.addHtml(`<img src="${gridUrl}" alt="image of grid">`);
            this.addHtml("</div>").newline();
        }

        this.addHtml("<table style='border-collapse: collapse'>").newline();
        this.addTableHeader(puzzle.publishOptions).newline();
        this.addHtml("<tbody>").newline();

        this.addClues(puzzle.clues.filter(c => c.group === "across"), puzzle.publishOptions, "ACROSS");
        this.addClues(puzzle.clues.filter(c => c.group === "down"), puzzle.publishOptions, "DOWN");

        this.addHtml("</tbody>").newline()
        this.addHtml("</table>").newline()

        this.addQuillDelta(puzzle.notes.footer);
        this.addHtml("</div>").newline();

        return this.buffer;

    }

    private addTableHeader(publishOptions: PublishOptions): ContentGeneratorTableLayout {
        if (publishOptions.textCols.length > 1) {
            this.addHtml("<thead>").newline();
            this.addHtml("<tr>").newline();
            this.addHtml("<th>No.</th>").newline();
            this.addAnswerColumnHeaders(publishOptions).newline();
            this.addHtml("<th>Comment</th>").newline();
            this.addHtml("<tr>").newline();
            this.addHtml("</thead>").newline();
        }
        return this;
    }

    private newline(): ContentGeneratorTableLayout {
        this.buffer = this.buffer.concat("\n");
        return this;
    }

    private addHtml(html: string): ContentGeneratorTableLayout {
        this.buffer = this.buffer.concat(html);
        return this;
    }

    private addText(text: string, textStyle?: TextStyle): ContentGeneratorTableLayout {
        let formattedText: string = "";

        if (textStyle) {
            formattedText = `<span style="${textStyle.toCssStyleString()}">${escape(text)}</span>`;
        } else {
            formattedText = escape(text);
        }
        this.buffer = this.buffer.concat(formattedText);
        return this;
    }

    private addQuillDelta(delta: QuillDelta): ContentGeneratorTableLayout {

        if (delta && delta.ops && delta.ops.length) {
            const converter = new QuillDeltaToHtmlConverter(
                delta.ops,
                { inlineStyles: true });

            this.buffer = this.buffer.concat(converter.convert());
        }
        return this;
    }

    private addAnswerColumnHeaders(publishOptions: PublishOptions): ContentGeneratorTableLayout {
        publishOptions.textCols.forEach((tc => {
            this.addHtml("<th>")
            .addHtml(escape(tc.caption))
            .addHtml("</th>")
            .newline();
        }));
        return this;
    }

    private addClues(clues: Clue[], publishOptions: PublishOptions, label: string): ContentGeneratorTableLayout {

        // add an ACROSS / DOWN heading
        let colspan = publishOptions.textCols.length + 2;
        this.addHtml("<tr>").newline();
        this.openTD(colspan).addText(label).closeTD();
        this.addHtml("</tr>").newline();

        // add the rows for each clue
        clues.forEach(clue => this.addClue(clue, publishOptions));
        return this;
    }

    private addClue(clue: Clue, publishOptions: PublishOptions) {

        // add a row for the clue and answer
        this.addHtml("<tr>").newline();

        this.openTD();
        this.addText(clue.caption, publishOptions.answerStyle);
        this.closeTD().newline();

        // if (publishOptions.modifyAnswers) {
        //     this.openTD();
        //     this.addText(clue.answerAlt, publishOptions.answerStyle);
        //     this.closeTD().newline();
        // }

        // this.openTD();
        // this.addText(clue.answer, publishOptions.answerStyle);
        // this.closeTD().newline();

        publishOptions.textCols.forEach((col, index) => {
            this.openTD();
            this.addText(clue.answers[index] || "", publishOptions.answerStyle);
            this.closeTD().newline();
        });

        this.openTD();
        this.addClueText(clue.chunks, publishOptions);
        this.closeTD().newline();

        this.addHtml("</tr>").newline();

        // add a row for the comments
        this.addHtml("<tr>").newline();

        const colspan = publishOptions.textCols.length + 1;

        this.openTD(colspan);
        this.addHtml("&nbsp;")
        this.closeTD().newline();

        this.openTD();
        this.addQuillDelta(clue.comment);
        this.closeTD().newline();

        this.addHtml("</tr>").newline();

        return this;
    }

    private addClueText(chunks: readonly TextChunk[], publishOptions: PublishOptions): ContentGeneratorTableLayout {

        chunks.forEach(chunk => {
            let textStyle = chunk.isDefinition ?
                publishOptions.definitionStyle :
                publishOptions.clueStyle;

            this.addHtml(`<span style="${textStyle.toCssStyleString()}">${chunk.text}</span>`);
        });
        return this;
    }

    private openTD(colspan?: number): ContentGeneratorTableLayout {
        const attr = colspan ? `colspan="${colspan}"` : "";
        this.buffer = this.buffer.concat(`<td ${attr} style='padding: ${this.tdPadding};'>`);
        return this;
    }

    private closeTD(): ContentGeneratorTableLayout {
        this.buffer = this.buffer.concat("</td>");
        return this;
    }
}