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
    @Input() latestAnswer: string;

    public model: ClueUpdate;;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
        this.model = new ClueUpdate(this.clue);
        this.model.answer = this.starterText ? this.starterText : this.clue.answer;
    }

    public close() {
        this.activeModal.close(this.model);
    }

    public cancel() {
        this.activeModal.close(null);
    }

    public onDefinitionChange(definition: string) {
        console.log("definitionCHange " + JSON.stringify(definition));
        this.model.definition = definition;
    }

    public showLatestAnswer(): boolean {
        return this.latestAnswer && /_+/.test(this.latestAnswer);
    }
}
