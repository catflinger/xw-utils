import { Component, OnInit, Input } from '@angular/core';
import { Clue } from 'src/app/model/clue';
import { TextStyle } from 'src/app/model/text-style';
import { TextChunk } from 'src/app/model/clue-text-chunk';

@Component({
    selector: 'app-clue-text',
    templateUrl: './clue-text.component.html',
    styleUrls: ['./clue-text.component.css']
})
export class ClueTextComponent implements OnInit {
    @Input() clue: Clue;
    @Input() textStyle: TextStyle;

    constructor() { }

    ngOnInit() {
    }

    makeChunkStyle(chunk: TextChunk): any {
        let result: any = {};

        result.color = "blue";
        if (chunk.isDefinition) {
            result["text-decoration"] = "underline";
        }
        return result;
    }
}
