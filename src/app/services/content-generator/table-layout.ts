import { Injectable } from '@angular/core';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { ContentGenerator } from '../common';
import { Attribute } from './attribute';
import { Root } from './root';
import { More } from './more';
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
        const answerColumnCount = puzzle.publishOptions.textCols.length;

        const root = new Root(
            // heading
            new QuillNode(puzzle.notes.header),
            new More(),

            // annotation
            new QuillNode(puzzle.notes.body),

            // grid
            puzzle.publishOptions.includeGrid ? 
                new Tag("p", 
                    new Tag("img", 
                        new Attribute("src", gridUrl),
                        new Attribute("alt", "picture of the completed grid")
                    )
                )
                :
                null,

            new Tag("div",
                new Attribute("class", `fts fts-table fts-spacing-${puzzle.publishOptions.spacing}`),

                // clues
                new Tag("table",
                    new Tag("tbody",
                        
                        // ACROSS title
                        puzzle.publishOptions.showClueGroups ? new Tag("tr", 
                            new Tag("td", 
                                new Text("ACROSS"), 
                                new Attribute("colspan", (answerColumnCount + 2).toString()),
                                new Attribute("class", "fts-group"),
                            )
                        ) : null,

                        // optional heading when there are multiple answer columns
                        this.makeHeadingRow(puzzle.publishOptions),
                        
                        // across clues
                        ...puzzle.clues.filter(c => c.group === "across")
                        .map(clue => this.makeClue(clue, puzzle.publishOptions))
                        .flat(),

                        // DOWN title
                        puzzle.publishOptions.showClueGroups ? new Tag("tr",
                            new Tag("td", 
                                new Text("DOWN"), 
                                new Attribute("colspan", (answerColumnCount +2).toString()),
                                new Attribute("class", "fts-group"),
                            )
                        ) : null,

                        // optional heading when there are multiple answer columns
                        this.makeHeadingRow(puzzle.publishOptions),

                        // down clues
                        ...puzzle.clues.filter(c => c.group === "down")
                        .map(clue => this.makeClue(clue, puzzle.publishOptions))
                        .flat()

                    ),
                )
            )
        );

        return root.toString();
    }

    private makeHeadingRow(publishOptions: PublishOptions): ContentNode {
        
        if (publishOptions.textCols.length > 1) {
            return new Tag("tr",
                new Attribute("style", "border-bottom: 1px solid"),
                new Tag("td", new Text("No.")),
                ...publishOptions.textCols.map(col => 
                    new Tag("td", new Text(col.caption))
                ),
                new Tag("td"),
            );
        }
        
        return null;
    }

    private makeClue(clue: Clue, publishOptions: PublishOptions): ContentNode[] {

        return [
            new Tag("tr",

                new Tag("td", 
                    new Attribute("class", "fts-subgroup"),
                    publishOptions.showClueCaptions ? new Tag("span", new Text(clue.caption)) : null,
                    this.makeTextStyleAttribute("clue", publishOptions),
                ),

                ...publishOptions.textCols.map((col, index) => new Tag("td", 
                    new Attribute("class", "fts-subgroup"),
                    new Tag("span",  new Text(clue.answers[index] || ""), 
                    this.makeTextStyleAttribute("answer", publishOptions))
                )),
                
                new Tag("td", 
                    new Attribute("class", "fts-subgroup"),
                    new Tag("div", ...clue.chunks.map(chunk => 
                        new Tag("span", new Text(chunk.text), this.makeChunkStyleAttribute(chunk, publishOptions)))
                    )
                ),
            ),

            new Tag("tr",
                new Attribute("class", "fts-subgroup"),
                new Tag("td", new Attribute("colspan", (publishOptions.textCols.length + 1).toString())),
                new Tag("td", new QuillNode(clue.comment)),
            ),
        ];
    }

    public makeTextStyleAttribute(styleName: TextStyleName, publishOptions: PublishOptions): ContentNode {
        const style = publishOptions.getStyle(styleName);

        return new Attribute("style", style.toCssStyleString());
    }

    public makeChunkStyleAttribute(chunk: TextChunk, publishOptions: PublishOptions): ContentNode {
        const clueStyle = publishOptions.getStyle("clue");
        const definitionStyle = publishOptions.getStyle("definition");

        return new Attribute("style", chunk.isDefinition ? definitionStyle.toCssStyleString() : clueStyle.toCssStyleString());
    }
}