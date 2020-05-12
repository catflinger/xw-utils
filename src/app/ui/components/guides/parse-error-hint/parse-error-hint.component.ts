import { Component, OnInit, Input } from '@angular/core';
import { TextParsingError } from 'src/app/model/puzzle-model/text-parsing-error';
import { TextParsingErrorCode } from 'src/app/model/interfaces';

@Component({
    selector: 'app-parse-error-hint',
    templateUrl: './parse-error-hint.component.html',
    styleUrls: ['./parse-error-hint.component.css']
})
export class ParseErrorHintComponent {
    @Input() public errorCode: TextParsingErrorCode;
}
