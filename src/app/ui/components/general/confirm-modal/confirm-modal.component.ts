import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

    @Input() message: string;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
    }

    public onClose(result: boolean) {
        this.activeModal.close(result);
    }

}
