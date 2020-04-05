import { Injectable, OnDestroy, Type } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponentName, EditorComponentFactory } from './editor-component.factory';

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
        private componentFactory: EditorComponentFactory,
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

        const component = this.componentFactory.getComponent(componentName);
        
        this.editor = {
            modalRef: null,
            componentName
        };

        this.editor.modalRef = this.modalService.open(component, { 
            backdrop: "static",
            size: "lg",
        });
        
        this.editor.modalRef.componentInstance.clueId = clueId;
        this.editor.modalRef.componentInstance.starterText = starterText;
    }

    public close() {
        if (this.editor) {
            this.editor.modalRef.close();
            this.editor = null;
        }
    }
}
