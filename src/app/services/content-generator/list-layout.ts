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
import { TextStyle } from 'src/app/model/puzzle-model/text-style';

@Injectable({
    providedIn: 'root'
})
export class ListLayout implements ContentGenerator {
    
    public getContent(puzzle: Puzzle, gridUrl: string): string {

        const root = new Tag("div",
            // heading
            new Tag("div", new QuillNode(puzzle.notes.header)),
            new Comment("MORE"),

            // annotation
            new Tag("div", new QuillNode(puzzle.notes.body)),

            new Tag("div", new Text("ACROSS")),
            new Tag("div", ...puzzle.clues.filter(c => c.group === "across").map(clue => this.makeClue(clue, puzzle.publishOptions))),

            new Tag("div", new Text("DOWN")),
            new Tag("div", ...puzzle.clues.filter(c => c.group === "down").map(clue => this.makeClue(clue, puzzle.publishOptions))),

            //footer
            new Tag("div", new QuillNode(puzzle.notes.footer)),
        );

        return root.toString();
    }

    private makeClue(clue: Clue, publishOptions: PublishOptions): ContentNode {
        const clueStyle = publishOptions.getStyle("clue");
        const definitionStyle = publishOptions.getStyle("definition");
        const answerStyle = publishOptions.getStyle("answer");

        return new Tag("div",
        
            // write the clue
            new Tag("div",
                publishOptions.useDefaults ? 
                    new Attribute("class", clueStyle.class) :
                    new Attribute("style", clueStyle.toCssStyleString()),
                new Text(clue.caption),
                new Text(". "),
                ...clue.chunks.map(chunk => 
                    new Tag("span", 
                        publishOptions.useDefaults ? 
                            new Attribute("class", chunk.isDefinition ? definitionStyle.class : clueStyle.class) :
                            new Attribute("style", chunk.isDefinition ? definitionStyle.toCssStyleString() : clueStyle.toCssStyleString()),
                        new Text(chunk.text), 
                    )
                ),
            ),

            // write the answer
            new Tag("div",
                new Attribute("class", "fts-answer"),
                publishOptions.useDefaults ? 
                    new Attribute("class", answerStyle.class) :
                    new Attribute("style", answerStyle.toCssStyleString()),
                new Text(clue.answers[0]),
            ),

            // write the comments
            new Tag("div",
                new QuillNode(clue.comment)
            )
        );
    }
}