import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Clue } from 'src/app/model/puzzle';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {
    @Input() clue: Clue;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

}
