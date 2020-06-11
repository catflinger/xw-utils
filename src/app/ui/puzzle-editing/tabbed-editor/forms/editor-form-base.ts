import { IClueEditorForm } from '../clue-editor/clue-editor.component';
import { ClueEditorService } from '../clue-editor.service';
import { OnDestroy } from '@angular/core';

export class EditorFormBase implements IClueEditorForm, OnDestroy {
    
    protected readonly instanceId: string = null;
    
    public dirty: import("@angular/core").EventEmitter<void>;

    constructor(protected readonly editorService: ClueEditorService) {
        this.instanceId = this.editorService.register(() => this.onSave());
    }

    protected onSave(): Promise<boolean> {
        console.log("SAVING IN THE BASE");
        return Promise.resolve(false);
    }

    public ngOnDestroy() {
        console.log("RELEASING THE EDITOR SERVICE");
        this.editorService.unRegister(this.instanceId);
    }

}