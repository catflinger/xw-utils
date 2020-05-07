import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { ClueEditorService } from '../clue-editor.service';

export interface IClueEditorForm {
    dirty: EventEmitter<void>;
} 

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueEditorComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    public activeId: string = "ClueAnnotatorComponent";
    
    public puzzle: Puzzle = null;
    public dirty: boolean = false;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private editorService: ClueEditorService,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {

                this.puzzle = puzzle;
                this.dirty = false;
                
                this.detRef.detectChanges();
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onDirty() {
        this.dirty = true;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        if (this.editorService.isActive) {
            this.editorService.save()
            .then(cancel => {
                if (cancel) {
                    event.preventDefault();
                } else {
                    this.dirty = false;
                }
                this.detRef.detectChanges();

            });
        }
    }

    public onSave() {
        if (this.editorService.isActive) {
            this.editorService.save()
            .then(cancel => {
                if (!cancel) {
                    this.closeAndCommit();
                    this.detRef.detectChanges();
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
