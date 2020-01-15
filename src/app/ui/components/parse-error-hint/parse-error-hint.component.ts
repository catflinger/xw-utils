import { Component, OnInit, Input } from '@angular/core';
import { TextParsingError } from 'src/app/model/text-parsing-error';
import { TextParsingErrorCode } from 'src/app/model/interfaces';

@Component({
    selector: 'app-parse-error-hint',
    templateUrl: './parse-error-hint.component.html',
    styleUrls: ['./parse-error-hint.component.css']
})
export class ParseErrorHintComponent implements OnInit {
    @Input() public error: TextParsingError;

    public code: TextParsingErrorCode;

    constructor() { }

    ngOnInit() {
        if (this.error) {
            this.code = this.error.code;
        }
    }

}
