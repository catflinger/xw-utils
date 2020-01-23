import { Component, OnInit, Input } from '@angular/core';
import { ITextParsingError } from 'src/app/model/interfaces';

@Component({
    selector: 'app-parse-result',
    templateUrl: './parse-result.component.html',
    styleUrls: ['./parse-result.component.css']
})
export class ParseResultComponent implements OnInit {
    @Input() public result: ITextParsingError = null;
    
    constructor() { }

    ngOnInit() {

// TO DO: convert the errors to hints here...

    }

}
