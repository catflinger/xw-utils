import { Component, OnInit, Input, Output, ViewChildren, QueryList, EventEmitter, OnChanges } from '@angular/core';
import { Clue } from 'src/app/model/puzzle';
import { ClueTextChunkComponent } from '../clue-text-chunk/clue-text-chunk.component';
import { ClueUpdate } from 'src/app/services/clue-update';

// ClueTextChunk is a ViewModel representing the definition mask string in a ui-friendly way 
export class ClueTextChunk {
    index: number;
    text: string;
    isDefinition: boolean;
    selectionStartOffset: number = null;
    selectionEndOffset: number = null;
}

@Component({
    selector: 'app-clue-text',
    templateUrl: './clue-text.component.html',
    styleUrls: ['./clue-text.component.css']
})
export class ClueTextComponent implements OnInit {

    @Input() model: ClueUpdate;
    @Output() definitionChange = new EventEmitter<string>();

    @ViewChildren(ClueTextChunkComponent) children: QueryList<ClueTextChunkComponent>;

    public chunks: ClueTextChunk[] = [];

    constructor() {
    }

    ngOnInit() {
        this.chunks = this.makeChunkArray(this.model);
    }

    public onChunkMouseUp() {
        if (window.getSelection) {
            let selection = window.getSelection();

            if (!selection.isCollapsed) {

                // NOTE: focus and anchor nodes represent the place the user began the selection and
                // the place the user ended the selection.  This selection might have been right-to-left
                // or left-to-right, ie focus might come beofre or after the anchor in the text.


                let fNode = selection.focusNode;
                let fOffset: number = selection.focusOffset;

                let aNode = selection.anchorNode;
                let aOffset = selection.anchorOffset;

                let aChunk: ClueTextChunk = null;
                let fChunk: ClueTextChunk = null;

                // find the chunks containing the anchor and focus
                this.children.forEach((component) => {
                    if (component.containsDomElement(aNode)) {
                        aChunk = component.chunk;
                    }
                    if (component.containsDomElement(fNode)) {
                        fChunk = component.chunk;
                    }
                });

                // work out which chunk is the start of the selection and which is hte end 
                let startChunk: ClueTextChunk;
                let endChunk: ClueTextChunk;

                if (aChunk && fChunk) {
                    if (aChunk.index == fChunk.index) {
                        // selection starts and ends in the same node
                        startChunk = aChunk;
                        endChunk = aChunk;
                        startChunk.selectionStartOffset = Math.min(aOffset, fOffset);
                        endChunk.selectionEndOffset = Math.max(aOffset, fOffset);
                    } else if (aChunk.index < fChunk.index) {
                        startChunk = aChunk;
                        endChunk = fChunk;
                        startChunk.selectionStartOffset = aOffset;
                        endChunk.selectionEndOffset = fOffset;
                    } else {
                        startChunk = fChunk;
                        endChunk = aChunk;
                        startChunk.selectionStartOffset = fOffset;
                        endChunk.selectionEndOffset = aOffset;
                    }

                    let newMask = this.makeDefinitionMask(startChunk, endChunk);
                    this.model.definition = newMask;
                }
            }
        }
    }

    private makeChunkArray(clue: ClueUpdate): ClueTextChunk[] {
        let chunks: ClueTextChunk[] = [];
        let textIndex = 0;
        let definitionMode = false;
        let chunkIndex = 0;

        let chunk = new ClueTextChunk();
        chunk.text = "";
        chunk.isDefinition = definitionMode;

        while (textIndex < clue.text.length) {
            if (textIndex < clue.definition.length) {

                if ((clue.definition.charAt(textIndex) === "d") !== definitionMode) {
                    definitionMode = !definitionMode;

                    //start a new chunk
                    if (chunk.text.length > 0) {
                        chunk.index = chunkIndex;
                        chunks.push(chunk);
                        chunkIndex++;

                    }

                    chunk = new ClueTextChunk();
                    chunk.text = "";
                }

                chunk.text = chunk.text + clue.text.charAt(textIndex);
                chunk.isDefinition = definitionMode;
            }
            textIndex++;
        }

        // add the remaining chunk, if there is one
        if (chunk && chunk.text.length > 0) {
            chunk.index = chunkIndex;
            chunks.push(chunk);
            chunkIndex++;
        }
    return chunks;
    }

    public makeDefinitionMask(startChunk: ClueTextChunk, endChunk: ClueTextChunk): string {
        //console.log("MAKING MASK FOR: " + JSON.stringify(chunks));
        let mask = "";

        for(let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];

            if (i < startChunk.index) {
                // before start of selection
                console.log("A");

                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.text.length);

            } else if (i === startChunk.index && i === endChunk.index) {
                // selection starts and ends here
                console.log("B");
            
                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.selectionStartOffset);
                mask += this.fillString("d", chunk.selectionEndOffset - chunk.selectionStartOffset);
                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.text.length - chunk.selectionEndOffset);

            } else if (i === startChunk.index && i < endChunk.index) {
                // selection starts here but ends later
                console.log("C");

                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.selectionStartOffset);
                mask += this.fillString("d", chunk.text.length - chunk.selectionEndOffset);

            } else if (i > startChunk.index && i < endChunk.index) {
                // this chunk is between start and end chunks
                console.log("D");

                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.text.length);

            } else if (i > startChunk.index && i === endChunk.index) {
                // this is the end chunk
                console.log("E");

                mask += this.fillString("d", chunk.selectionEndOffset);
                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.text.length - chunk.selectionEndOffset);

            } else if (i > endChunk.index) {
                // after the end chunk
                console.log("F");

                mask += this.fillString(chunk.isDefinition ? "d" : "0", chunk.text.length);
            }
        }
        return mask;
    }

    private fillString(char: string, length: number): string {
        if (String.prototype.repeat) {
            return char.repeat(length);
        } else {
            let result = "";
            for (let i = 0; i < length; i++) {
                result += char;
            }
            return result;
        }
    }
}
