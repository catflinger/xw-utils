import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponentName } from './editor-component.factory';
import { ClueEditorComponent } from './clue-editor/clue-editor.component';

export interface ClueEditor {
    modalRef: NgbModalRef,
    componentName: ClueEditorComponentName,
}

@Injectable({
    providedIn: 'root'
})
export class ClueEditorService implements OnDestroy {

    private editor: ClueEditor;
    private subs: Subscription[] = [];

    constructor(
        private modalService: NgbModal,
    ) {
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public get isOpen(): boolean {
        return this.editor !== null;
    }

    public get selectedEditorId(): ClueEditorComponentName {
        return this.editor ? this.editor.componentName : null;
    }

    public open(clueId: string, starterText: string, componentName: ClueEditorComponentName) {
        
        if (this.isOpen) {
            this.close();
        }

        this.editor = {
            modalRef: null,
            componentName
        };

        this.editor.modalRef = this.modalService.open(ClueEditorComponent, { 
            backdrop: "static",
            size: "lg",
        });
        
        this.editor.modalRef.componentInstance.clueId = clueId;
        this.editor.modalRef.componentInstance.starterText = starterText;
        this.editor.modalRef.componentInstance.close.subscribe(() => this.close());
    }

    public close() {
        if (this.editor) {
            this.editor.modalRef.close();
            this.editor = null;
        }
    }
}
