import { Component, OnInit, Output, EventEmitter, Type } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorService } from '../clue-editor.service';
import { ClueEditorComponentName } from '../editor-component.factory';

@Component({
    selector: 'app-clue-editor-nav',
    templateUrl: './clue-editor-nav.component.html',
    styleUrls: ['./clue-editor-nav.component.css']
})
export class ClueEditorNavComponent implements OnInit {

    public activeId: ClueEditorComponentName;

    @Output()
    public nav = new EventEmitter<ClueEditorComponentName>();

    constructor(
        private editorService: ClueEditorService,
    ) { }

    ngOnInit(): void {
        this.activeId = this.editorService.selectedEditorId;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        event.preventDefault();
        this.nav.emit(event.nextId);
    }
}
