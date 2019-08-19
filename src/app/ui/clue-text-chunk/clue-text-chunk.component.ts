import { Component, OnInit, Input, Output, EventEmitter, ContentChildren, QueryList, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { ClueTextChunk } from '../clue-text/clue-text.component';

@Component({
    selector: 'app-clue-text-chunk',
    templateUrl: './clue-text-chunk.component.html',
    styleUrls: ['./clue-text-chunk.component.css']
})
export class ClueTextChunkComponent implements OnInit {
    @Input() chunk: ClueTextChunk;
    @Output()chunkMouseUp = new EventEmitter<any>();

    @ViewChild("span", { static: false}) spanElemnt: ElementRef;

    constructor() { }

    ngOnInit() {
    }

    public cssClass(): string {
        return this.chunk.isDefinition ? "definition" : "plain";
    };

    public onMouseUp() {
        this.chunkMouseUp.emit(this.chunk);
    }

    public containsDomElement(target: any): boolean {
        let result = false;

        let node = this.spanElemnt.nativeElement as Node;

        if (node.contains(target)) {
            result = true;
        }

        return result;
    }
}
