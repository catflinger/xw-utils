import { Component, OnInit, Input } from '@angular/core';
import { IParseContext } from 'src/app/services/parsing/text/text-parsing-context';

@Component({
    selector: 'app-parse-result',
    templateUrl: './parse-result.component.html',
    styleUrls: ['./parse-result.component.css']
})
export class ParseResultComponent implements OnInit {
    @Input() public result: IParseContext = null;
    
    constructor() { }

    ngOnInit() {
    }

}
