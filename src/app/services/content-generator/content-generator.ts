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
    private tdPadding = "5px"

    constructor(private puzzle: Puzzle) {
    }

    public getContent(): string {
        this.addHtml("<div>");
        this.addQuillDelta(this.puzzle.notes.header);
        this.addHtml("<!-- MORE -->");
        this.addQuillDelta(this.puzzle.notes.body);

        this.addHtml("<table>")
        this.addHtml("<tbody>")

        this.addHtml("<tr>");
        this.openTD(3);
        this.addText("ACROSS");
        this.closeTD();
        this.addHtml("</tr>");

        this.addClues(this.puzzle.clues.filter(c => c.group === "across"));

        this.addHtml("<tr>");
        this.openTD(3);
        this.addText("ACROSS");
        this.closeTD();
        this.addHtml("</tr>");

        this.addClues(this.puzzle.clues.filter(c => c.group === "down"));

        this.addHtml("</tbody>")
        this.addHtml("</table>")

        this.addQuillDelta(this.puzzle.notes.footer);
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
            const converter  = new QuillDeltaToHtmlConverter(
                delta.ops,
                { inlineStyles: true});

            this.buffer = this.buffer.concat(converter.convert());
        }
    }

    private addClues(clues: Clue[]) {
        clues.forEach(clue => this.addClue(clue));
    }

    private addClue(clue: Clue) {

        // add a row for the clue and answer
        this.addHtml("<tr>");

        this.openTD();
        this.addText(clue.caption, this.puzzle.publishOptions.clueStyle);
        this.closeTD();

        this.openTD();
        this.addText(clue.answer, this.puzzle.publishOptions.answerStyle);
        this.closeTD();

        this.openTD();
        this.addClueText(clue.chunks, this.puzzle.publishOptions);
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

    private addClueText(chunks: readonly TextChunk[], publishOptions: PublishOptions){

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