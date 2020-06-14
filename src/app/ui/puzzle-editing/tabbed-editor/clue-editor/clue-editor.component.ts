import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription, combineLatest } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { ClueEditorService } from '../clue-editor.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';

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
    public settings: AppSettings;

    private subs: Subscription[] = [];

    constructor(
        private settingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private editorService: ClueEditorService,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {

        this.subs.push(combineLatest(
            
            this.settingsService.observe(),
            this.activePuzzle.observe())
            .subscribe(result => {

                let settings = result[0];
                let puzzle = result[1];

                if (settings) {
                    this.settings = settings;
                    if (puzzle) {
                        this.puzzle = puzzle;
                        this.dirty = false;
                    }
                }
            this.detRef.detectChanges();
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public get showTabs(): boolean {
        return this.settings ? this.settings.general.tabbedEditor.enabled : true;
    }

    public onDirty() {
        this.dirty = true;
        this.detRef.detectChanges();
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
                }
                this.detRef.detectChanges();
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