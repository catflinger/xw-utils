import { Component, OnInit, Input, Output, ViewChildren, QueryList, EventEmitter, OnChanges, forwardRef, HostListener } from '@angular/core';
import { ClueTextChunkComponent } from '../clue-text-chunk/clue-text-chunk.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextChunk } from 'src/app/model/puzzle-model/clue-text-chunk';

// ClueTextChunk is a ViewModel representing the definition mask string in a ui-friendly way 
export class ClueTextChunk {
    constructor (
        public index: number,
        public text: string,
        public isDefinition: boolean,
        public selectionStartOffset: number = null,
        public selectionEndOffset: number = null,
    ) {}
}

@Component({
    selector: 'app-clue-text-control',
    templateUrl: './clue-text-control.component.html',
    styleUrls: ['./clue-text-control.component.css'],
    providers: [    { 
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ClueTextControlComponent),
        multi: true
    }],
})
export class ClueTextControlComponent implements ControlValueAccessor, OnInit {

    public chunks: ClueTextChunk[] = [];
    public definition: string;

    private propagateChange = (_: any) => { };

    @ViewChildren(ClueTextChunkComponent) children: QueryList<ClueTextChunkComponent>;
    @Output() change = new EventEmitter<void>();

    constructor() {
    }

    writeValue(chunks: TextChunk[]) {
        if (chunks !== undefined) {
            this.chunks = [];
            chunks.forEach((chunk, index) => this.chunks.push(
                new ClueTextChunk(
                    index,
                    chunk.text,
                    chunk.isDefinition
                )
            ));
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    ngOnInit() {
    }

    public onMouseUp() {
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

                // work out which chunk is the start of the selection and which is the end 
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

                    this.chunks = this.consolidateChunkArray();
                    this.propagateChange(this.chunks);
                    this.change.emit();
               }
            }
            selection.removeAllRanges();
        }
    }

    private consolidateChunkArray(): ClueTextChunk[] {
        let result: ClueTextChunk[] = [];
        let index = 0;
        const indexBound = this.chunks.length;
        let chunkCount = 0;

        // copy up to, but not including, the first chunk in the selection
        while (index < indexBound && this.chunks[index].selectionStartOffset === null) {
            let oldChunk = this.chunks[index];

            // copy the chunk across as-is
            result.push(new ClueTextChunk(chunkCount, oldChunk.text, oldChunk.isDefinition, null, null));
            chunkCount++;
            index++;
        }

        // copy up to, but not including, the last chunk in the selection
        while (index < indexBound && this.chunks[index].selectionEndOffset === null) {
            let oldChunk = this.chunks[index];
            
            if (oldChunk.selectionStartOffset) {
                // split the chunk into two parts, second becomes definition
                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(0, oldChunk.selectionStartOffset), oldChunk.isDefinition, null, null));
                chunkCount++;
                
                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(oldChunk.selectionStartOffset), true, null, null));
                chunkCount++;
            } else {
                // copy the whole chunk as a definition
                result.push(new ClueTextChunk(chunkCount, oldChunk.text, true, null, null));
                chunkCount++;
            }
            index++;
        }

        // copy the remaining chunks
        while (index < indexBound) {
            let oldChunk = this.chunks[index];
            
            if (oldChunk.selectionStartOffset && oldChunk.selectionEndOffset) {
                // split the chunk into three parts, middle part becomes definition
                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(0, oldChunk.selectionStartOffset), oldChunk.isDefinition, null, null));
                chunkCount++;

                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(oldChunk.selectionStartOffset, oldChunk.selectionEndOffset), true, null, null));
                chunkCount++;

                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(oldChunk.selectionEndOffset), oldChunk.isDefinition, null, null));
                chunkCount++;
            } else if (oldChunk.selectionEndOffset) {
                // split the chunk into two parts, first becomes definition
                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(0, oldChunk.selectionEndOffset), true, null, null));
                chunkCount++;

                result.push(new ClueTextChunk(chunkCount, oldChunk.text.substring(oldChunk.selectionEndOffset), oldChunk.isDefinition, null, null));
                chunkCount++;
            } else {
                // copy the chunk as-is
                result.push(new ClueTextChunk(chunkCount, oldChunk.text, oldChunk.isDefinition, null, null));
                chunkCount++;
            }
            index++;
        }

        return result;
    }
}
