import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-puzzle-editor',
  templateUrl: './puzzle-editor.component.html',
  styleUrls: ['./puzzle-editor.component.css']
})
export class PuzzleEditorComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    public activeId: string = "AddClueComponent";
    
    public puzzle: Puzzle = null;
    public dirty: boolean = false;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
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
    }

    public onSave() {
        this.closeAndCommit();
    }

    public onCancel() {
        this.closeAndDiscard();
    }

    public onClose() {
        this.closeAndCommit();
    }

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
