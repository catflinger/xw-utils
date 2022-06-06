import { IClueEditorForm } from '../clue-dialog/clue-dialog.component';
import { ClueDialogService } from '../clue-dialog.service';
import { Inject, Injectable, OnDestroy } from '@angular/core';

// TODO: Add Angular decorator.
@Injectable()
export class TabbedDialogFormBase implements IClueEditorForm, OnDestroy {
    
    protected readonly instanceId: string = null;
    
    public dirty: import("@angular/core").EventEmitter<void>;

    constructor(protected readonly editorService: ClueDialogService) {
        this.instanceId = this.editorService.register(() => this.onSave());
    }

    protected onSave(): Promise<boolean> {
        return Promise.resolve(false);
    }

    public ngOnDestroy() {
        this.editorService.unRegister(this.instanceId);
    }
}