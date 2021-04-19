import { IClueEditorForm } from '../clue-dialog/clue-dialog.component';
import { ClueEditorService } from '../clue-editor.service';
import { OnDestroy } from '@angular/core';

// TODO: Add Angular decorator.
export class EditorFormBase implements IClueEditorForm, OnDestroy {
    
    protected readonly instanceId: string = null;
    
    public dirty: import("@angular/core").EventEmitter<void>;

    constructor(protected readonly editorService: ClueEditorService) {
        this.instanceId = this.editorService.register(() => this.onSave());
    }

    protected onSave(): Promise<boolean> {
        return Promise.resolve(false);
    }

    public ngOnDestroy() {
        this.editorService.unRegister(this.instanceId);
    }
}