import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorService } from '../clue-editor.service';

export interface ClueEditorInstance {
    confirmClose: () => boolean;
    save: () => void;
}

export interface IClueEditor {
    instance: EventEmitter<ClueEditorInstance>;
} 


@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {
    @Input() starterText: string;
    @Output() close = new EventEmitter<void>();

    public activeId: string = "ClueAnnotatorComponent";

    private editorInstance: ClueEditorInstance = null;

    constructor(
        //private editorService: ClueEditorService,
    ) { }

    public ngOnInit(): void {
    }

    public onEditorInstance(instance: ClueEditorInstance) {
        this.editorInstance = instance;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        let cancel = false;

        if (this.editorInstance) {
            cancel = this.editorInstance.confirmClose();
            if (cancel) {
                event.preventDefault();
            } else {
                this.editorInstance.save();
            }
        }
    }

    public onSave() {
        if (this.editorInstance) {
            const cancel = this.editorInstance.confirmClose();
            
            if (!cancel) {
                this.editorInstance.save();
            }
        }
        this.close.emit();
    }

    public onCancel() {
        this.close.emit();
    }

}
