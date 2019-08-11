import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Clue } from 'src/app/model/puzzle';
import { ClueUpdate } from 'src/app/services/clue-update';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {
    @Input() clue: Clue;
    @Input() starterText: string;

    public model: ClueUpdate = new ClueUpdate;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
        console.log("OnInit");
        this.model.answer = this.starterText ? this.starterText : this.clue.answer;
        this.model.comment = this.clue.comment;
    }

    public close() {
        this.activeModal.close(this.model);
    }

    public cancel() {
        this.activeModal.close(null);
    }

}
