import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from './clue-editor/clue-editor.component';

export interface ClueEditor {
    modalRef: NgbModalRef
}

@Injectable({
    providedIn: 'root'
})
export class ClueEditorService implements OnDestroy {

    private modalRef: NgbModalRef;
    private subs: Subscription[] = [];

    constructor(
        private modalService: NgbModal,
    ) {
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public open(clueId: string, starterText: string) {
        
        if (this.modalRef !== null) {
            this.close();
            this.modalRef = null;
        }

        this.modalRef = this.modalService.open(ClueEditorComponent, { 
            backdrop: "static",
            size: "lg",
        });
        
        this.modalRef.componentInstance.clueId = clueId;
        this.modalRef.componentInstance.starterText = starterText;
        this.modalRef.componentInstance.close.subscribe(() => this.close());
    }

    public close() {
        if (this.modalRef) {
            this.modalRef.close();
            this.modalRef = null;
        }
    }

}
