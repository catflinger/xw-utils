import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Cheat } from 'src/app/modifiers/clue-modifiers/cheat';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';
import { EditorFormBase } from '../editor-form-base';

@Component({
    selector: 'app-cheat-form',
    templateUrl: './cheat-form.component.html',
    styleUrls: ['./cheat-form.component.css']
})
export class CheatFormComponent extends EditorFormBase implements OnDestroy {
    
    @Output() close = new EventEmitter<void>();

    constructor(
        private activePuzzle: IActivePuzzle,
        editorService: ClueEditorService,
    ) {
        super(editorService)
    }

    public onCheat() {
        this.activePuzzle.updateAndCommit(new Cheat(), new SyncGridContent());
        this.close.emit();
    }
}
