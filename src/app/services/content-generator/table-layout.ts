import { Injectable } from '@angular/core';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { ContentGenerator } from '../common';
import { Attribute } from './attribute';
import { Comment } from './comment';
import { Tag } from './tag';
import { Text } from "./text";
import { ContentNode } from './content-node';
import { QuillNode } from './quill-node';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { TextStyleName } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/puzzle-model/clue-text-chunk';

@Injectable({
    providedIn: 'root'
})
export class TableLayout implements ContentGenerator {
    
    public getContent(puzzle: Puzzle, gridUrl: string): string {

        const root = new Tag("div",
        new Attribute("class", `fts fts-list fts-spacing-${puzzle.publishOptions.spacing}`),
        // heading
            new Tag("div", new QuillNode(puzzle.notes.header)),
            new Comment("MORE"),

            // annotation
            new Tag("div", new QuillNode(puzzle.notes.body)),

            // grid
            puzzle.publishOptions.includeGrid ? 
                new Tag("div", 
                    new Tag("img", 
                        new Attribute("src", gridUrl),
                        new Attribute("alt", "picture of the completed grid")
                    )
                )
                :
                null,

            // clues
            new Tag("table",
                new Tag("tbody",
                    
                    // ACROSS title
                    new Tag("tr", 
                        new Tag("td", new Text("ACROSS"), new Attribute("colspan", "3"))
                    ),
                    
                    // across clues
                    ...puzzle.clues.filter(c => c.group === "across")
                    .map(clue => this.makeClue(clue, puzzle.publishOptions))
                    .flat(),

                    // DOWN title
                    new Tag("tr", 
                        new Tag("td", new Text("DOWN"), new Attribute("colspan", "3"))
                    ),

                    // down clues
                    ...puzzle.clues.filter(c => c.group === "down")
                    .map(clue => this.makeClue(clue, puzzle.publishOptions))
                    .flat()

                ),
            )
        );

        return root.toString();
    }

    private makeClue(clue: Clue, publishOptions: PublishOptions): ContentNode[] {

        return [
            new Tag("tr",
                new Tag("td", new Tag("span", 
                    new Text(clue.caption)),
                    this.makeTextStyleAttribute("clue", publishOptions),
                ),
                new Tag("td", new Tag("span",  new Text(clue.answers[0]), this.makeTextStyleAttribute("answer", publishOptions))),
                
                new Tag("td", new Tag("div", ...clue.chunks.map(chunk => 
                    new Tag("span", new Text(chunk.text), this.makeChunkStyleAttribute(chunk, publishOptions)))
                )),
            ),

            new Tag("tr",
                new Tag("td"),
                new Tag("td"),
                new Tag("td", new QuillNode(clue.comment)),
            ),
        ];
    }

    public makeTextStyleAttribute(styleName: TextStyleName, publishOptions: PublishOptions): ContentNode {
        const style = publishOptions.getStyle(styleName);

        return publishOptions.useDefaults ? 
            new Attribute("class", style.class) :
            new Attribute("style", style.toCssStyleString());
    }

    public makeChunkStyleAttribute(chunk: TextChunk, publishOptions: PublishOptions): ContentNode {
        const clueStyle = publishOptions.getStyle("clue");
        const definitionStyle = publishOptions.getStyle("definition");

        return publishOptions.useDefaults ? 
            new Attribute("class", chunk.isDefinition ? definitionStyle.class : clueStyle.class) :
            new Attribute("style", chunk.isDefinition ? definitionStyle.toCssStyleString() : clueStyle.toCssStyleString());
    }
}