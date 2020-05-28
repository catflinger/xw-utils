import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Cheat } from 'src/app/modifiers/clue-modifiers/cheat';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';

@Component({
    selector: 'app-cheat-form',
    templateUrl: './cheat-form.component.html',
    styleUrls: ['./cheat-form.component.css']
})
export class CheatFormComponent implements OnInit, OnDestroy {
    private instanceId: string = null;
    
    @Output() close = new EventEmitter<void>();

    constructor(
            private activePuzzle: IActivePuzzle,
            private editorService: ClueEditorService,
            ) { }

    public ngOnInit(): void {
        this.instanceId = this.editorService.register(() => Promise.resolve(false));
    }

    public ngOnDestroy() {
        this.editorService.unRegister(this.instanceId);
    }

    public onCheat() {
        this.activePuzzle.updateAndCommit(new Cheat(), new SyncGridContent());
        this.close.emit();
    }
}
