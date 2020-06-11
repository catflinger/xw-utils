import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { ClueEditorService } from '../../clue-editor.service';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { DeleteClue } from 'src/app/modifiers/clue-modifiers/delete-clue';
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { EditorFormBase } from '../editor-form-base';

@Component({
    selector: 'app-add-remove-clue',
    templateUrl: './add-remove-clue.component.html',
    styleUrls: ['./add-remove-clue.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRemoveClueComponent extends EditorFormBase implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    
    public  clue: Clue;
    public letters: string[];

    @Output() dirty = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    constructor(
        private activePuzzle: IActivePuzzle,
        editorService: ClueEditorService,
    ) { 
        super(editorService)
    }

    public ngOnInit() {

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        this.clue = puzzle.getSelectedClue();
                        if (this.clue) {
                            this.letters = Array.from(this.clue.text)
                        } else {
                            this.letters = [];
                        }
                    }
                }
            )
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        super.ngOnDestroy();
    }

    public onLetterClick(index: number) {
        // TO DO: ...
        console.log("You clicked " + index)
    }

    public onRemoveClue() {
        this.activePuzzle.update(
            new DeleteClue(this.clue.id),
            new SyncGridContent(),
            new Clear(),
        );
        
        this.close.emit();
    }
}
