import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

export interface ClueEditorInstance {
    //confirmClose: () => boolean;
    save: () => Promise<boolean>;
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
    ) { }

    public ngOnInit(): void {
    }

    public onEditorInstance(instance: ClueEditorInstance) {
        this.editorInstance = instance;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        event.preventDefault();

        if (this.editorInstance) {
            this.editorInstance.save()
            .then(cancel => {
                if (!cancel) {
                    this.activeId = event.nextId;
                }
            });
        }
    }

    public onSave() {
        if (this.editorInstance) {
            this.editorInstance.save()
            .then(cancel => {
                if (!cancel) {
                    this.close.emit();
                }
            });
        }
    }

    public onCancel() {
        this.close.emit();
    }

}
