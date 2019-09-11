import { Component, OnInit, Input } from '@angular/core';
import { Clue } from 'src/app/model/clue';
import { TextStyle } from 'src/app/model/text-style';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/publish-options';

@Component({
    selector: 'app-clue-text',
    templateUrl: './clue-text.component.html',
    styleUrls: ['./clue-text.component.css']
})
export class ClueTextComponent implements OnInit {
    @Input() clue: Clue;
    @Input() publishOptions: PublishOptions;

    constructor() { }

    ngOnInit() {
    }

    makeChunkStyle(chunk: TextChunk): any {
        let result: any = {};
        let textStyle: TextStyle = chunk.isDefinition ? 
            this.publishOptions.definitionStyle :
            this.publishOptions.clueStyle;

        result.color = textStyle.color;

        result["text-decoration"] = textStyle.underline ?  "underline": "none";
        result["font-weight"] = textStyle.bold ?  "bold": "normal";
        result["font-style"] = textStyle.italic ?  "italic": "normal";

        return result;
    }
}
