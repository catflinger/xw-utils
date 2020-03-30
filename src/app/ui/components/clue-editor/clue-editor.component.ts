import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {

    @Input() starterText: string;

    @Output() close = new EventEmitter<string>();

    constructor(
    ) { }

    public ngOnInit() {
    }
}
