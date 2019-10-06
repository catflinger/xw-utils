import { Puzzle } from 'src/app/model/puzzle';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { QuillDelta } from 'src/app/model/interfaces';
import { Clue } from 'src/app/model/clue';
import escape from "escape-html";
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/publish-options';
import { TextStyle } from 'src/app/model/text-style';

export class PostContentGenerator {
    private buffer: string = "";
    private tdPadding = "3px";

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    constructor() {
    }

    public getContent(puzzle: Puzzle, gridUrl: string): string {
        this.addHtml("<div>");
        this.addQuillDelta(puzzle.notes.header);
        this.addHtml("<!-- MORE -->");
        this.addQuillDelta(puzzle.notes.body);

        if (gridUrl) {
            this.addHtml("<div>");
            this.addHtml(`<img src="${gridUrl}" alt="image of grid">`);
            this.addHtml("</div>");
        }

        this.addHtml("<table>")
        this.addHtml("<tbody>")

        this.addHtml("<tr>");
        this.openTD(3);
        this.addText("ACROSS");
        this.closeTD();
        this.addHtml("</tr>");

        this.addClues(puzzle.clues.filter(c => c.group === "across"), puzzle.publishOptions);

        this.addHtml("<tr>");
        this.openTD(3);
        this.addText("ACROSS");
        this.closeTD();
        this.addHtml("</tr>");

        this.addClues(puzzle.clues.filter(c => c.group === "down"), puzzle.publishOptions);

        this.addHtml("</tbody>")
        this.addHtml("</table>")

        this.addQuillDelta(puzzle.notes.footer);
        this.addHtml("</div>");

        return this.buffer;

    }

    private addHtml(html: string) {
        this.buffer = this.buffer.concat(html);
    }

    private addText(text: string, textStyle?: TextStyle) {
        let formattedText: string = "";

        if (textStyle) {
            formattedText = `<span style="${textStyle.toCssStyleString()}">${escape(text)}</span>`;
        } else {
            formattedText = escape(text);
        }
        this.buffer = this.buffer.concat(formattedText);
    }

    private addQuillDelta(delta: QuillDelta) {

        if (delta && delta.ops && delta.ops.length) {
            const converter = new QuillDeltaToHtmlConverter(
                delta.ops,
                { inlineStyles: true });

            this.buffer = this.buffer.concat(converter.convert());
        }
    }

    private addClues(clues: Clue[], publishOptions: PublishOptions) {
        clues.forEach(clue => this.addClue(clue, publishOptions));
    }

    private addClue(clue: Clue, publishOptions: PublishOptions) {

        // add a row for the clue and answer
        this.addHtml("<tr>");

        this.openTD();
        this.addText(clue.caption, publishOptions.answerStyle);
        this.closeTD();

        this.openTD();
        this.addText(clue.answer, publishOptions.answerStyle);
        this.closeTD();

        this.openTD();
        this.addClueText(clue.chunks, publishOptions);
        this.closeTD();

        this.addHtml("</tr>");

        // add a row for the comments
        this.addHtml("<tr>");

        this.openTD(2);
        this.addHtml("&nbsp;")
        this.closeTD();

        this.openTD();
        this.addQuillDelta(clue.comment);
        this.closeTD();

        this.addHtml("</tr>");

    }

    private addClueText(chunks: readonly TextChunk[], publishOptions: PublishOptions) {

        chunks.forEach(chunk => {
            let textStyle = chunk.isDefinition ?
                publishOptions.definitionStyle :
                publishOptions.clueStyle;

            this.addHtml(`<span style="${textStyle.toCssStyleString()}">${chunk.text}</span>`);
        });
    }

    private openTD(colspan?: number) {
        const attr = colspan ? `colspan="${colspan}"` : "";
        this.buffer = this.buffer.concat(`<td ${attr} style='padding: ${this.tdPadding};'>`);
    }

    private closeTD() {
        this.buffer = this.buffer.concat("</td>");
    }


}