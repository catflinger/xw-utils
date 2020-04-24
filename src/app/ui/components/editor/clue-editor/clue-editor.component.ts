import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle';

export interface ClueEditorFormInstance {
    save: () => Promise<boolean>;
}

export interface IClueEditorForm {
    instance: EventEmitter<ClueEditorFormInstance>;
    dirty: EventEmitter<void>;
} 

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    public activeId: string = "ClueAnnotatorComponent";
    
    public puzzle: Puzzle = null;
    public dirty: boolean = false;

    private formInstance: ClueEditorFormInstance = null;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
    ) { }

    public ngOnInit(): void {
        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {

                this.puzzle = puzzle;
                this.dirty = false;
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onEditorInstance(instance: ClueEditorFormInstance) {
        this.formInstance = instance;
    }

    public onDirty() {
        this.dirty = true;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        if (this.formInstance) {
            
            this.formInstance.save()
            .then(cancel => {
                if (cancel) {
                    event.preventDefault();
                } else {
                    this.dirty = false;
                    this.activeId = event.nextId;
                }
            });
        }
    }

    public onSave() {
        if (this.formInstance) {
            this.formInstance.save()
            .then(cancel => {
                if (!cancel) {
                    this.closeAndCommit();
                }
            });
        }
    }

    public onCancel() {
        this.closeAndDiscard();
    }

    public onClose() {
        this.closeAndDiscard();
    }

    public get hideSaveCancelButtons(): boolean {
        let result = true;

        if (this.puzzle) {
            result = !(this.puzzle.uncommitted || this.dirty); 
        }

        return result;
    };

    private closeAndCommit() {
        this.dirty = false;
        this.activePuzzle.commit();
        this.close.emit();
    }

    private closeAndDiscard() {
        this.dirty = false;
        this.activePuzzle.discard();
        this.close.emit();
    }

}
