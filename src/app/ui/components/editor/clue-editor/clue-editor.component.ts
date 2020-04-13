import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle';

export interface ClueEditorInstance {
    save: () => Promise<boolean>;
}

export interface IClueEditor {
    instance: EventEmitter<ClueEditorInstance>;
    dirty: EventEmitter<void>;
} 

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit, OnDestroy {
    @Input() starterText: string;
    @Output() close = new EventEmitter<void>();

    public activeId: string = "ClueAnnotatorComponent";
    
    public puzzle: Puzzle = null;
    public dirty: boolean = false;

    private editorInstance: ClueEditorInstance = null;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
    ) { }

    public ngOnInit(): void {
        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => this.puzzle = puzzle)
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onEditorInstance(instance: ClueEditorInstance) {
        this.editorInstance = instance;
    }

    public onDirty() {
        this.dirty = true;
    }

    public onNavChange(event: NgbNavChangeEvent) {
        event.preventDefault();

        if (this.editorInstance) {
            this.editorInstance.save()
            .then(cancel => {
                if (!cancel) {
                    this.dirty = false;
                    this.activeId = event.nextId;
                }
            });
        }
    }

    public onSave() {
        if (this.editorInstance) {
            this.editorInstance.save()
            .then(cancel => {
                if (!cancel) {
                    this.dirty = false;
                    this.close.emit();
                }
            });
        }
    }

    public onCancel() {
        this.close.emit();
    }

    public onClose() {
        this.close.emit();
    }

    public get hideSaveCancelButtons(): boolean {
        let result = true;

        if (this.puzzle) {
            result = !(this.puzzle.uncommitted || this.dirty); 
        }

        return result;
    };

}
