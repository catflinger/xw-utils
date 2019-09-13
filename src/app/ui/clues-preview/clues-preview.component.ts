import { Component, OnInit, Input } from '@angular/core';
import { Clue } from 'src/app/model/clue';
import { TextStyle } from 'src/app/model/text-style';
import { PublishOptions } from 'src/app/model/publish-options';

@Component({
  selector: 'app-clues-preview',
  templateUrl: './clues-preview.component.html',
  styleUrls: ['./clues-preview.component.css']
})
export class CluesPreviewComponent implements OnInit {
    public answerStyle: any = {};
    public clueStyle: any = {};
    public definitionStyle: any = {};

    @Input() public clues: Clue[];
    @Input() public publishOptions: PublishOptions;
    @Input() public includeGrid: boolean;

    constructor() { }

    ngOnInit() {
    }

    public makeAnswerStyle(): any {
        if (this.publishOptions) {
            return this.makeStyle(this.publishOptions.answerStyle);
        }
        return {};
    }

    public makeClueStyle(): any {
        if (this.publishOptions) {
            return this.makeStyle(this.publishOptions.clueStyle);
        }
        return {};
    }

    private makeStyle(textStyle: TextStyle): any {
        return {
            "color": textStyle.color,
            "font-weight": textStyle.bold ? "bold" : "normal",
            "font-style": textStyle.italic ? "italic" : "normal",
            "text-decoration": textStyle.underline ? "underline" : "unset",
        }
}
}
