import { Component, OnInit, OnDestroy, Output, EventEmitter, Type, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { AddTextColumn } from 'src/app//modifiers/publish-options-modifiers/add-text-column';
import { DeleteTextColumn } from 'src/app//modifiers/publish-options-modifiers/delete-text-column';
import { UpdateTextColumn } from 'src/app/modifiers/publish-options-modifiers/update-text-column';
import { ClueDialogService } from '../../clue-dialog.service';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';

@Component({
    selector: 'app-publish-options-form',
    templateUrl: './publish-options-form.component.html',
    styleUrls: ['./publish-options-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishOptionsFormComponent extends TabbedDialogFormBase implements OnInit, OnDestroy {
    public form: FormGroup;

    @Input() public clueId: string;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        editorService: ClueDialogService
    ) { 
        super(editorService)
    }

    public get answerColsArray(): FormArray {
        return this.form.get("answerCols") as FormArray;
    }

    public ngOnInit() {

        this.form = new FormGroup({
            "answerCols": new FormArray([]),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.answerColsArray.clear();
                this.makeControls(puzzle.publishOptions).forEach(control => this.answerColsArray.push(control));
            }
            this.detRef.detectChanges();
        }));
    }

    private makeControls(publishOptions: PublishOptions): FormGroup[] {
        let controls: FormGroup[] = [];

        publishOptions.textCols.forEach(col => {
            controls.push(new FormGroup({
                "caption": new FormControl(col.caption),
                "textStyle": new FormControl(col.style),
            }));
        });

        return controls;
    }

    public  ngOnDestroy() {
        this.subs.forEach(s => s .unsubscribe());
        super.ngOnDestroy();
    }

    public onAddColumn() {
        this.activePuzzle.updateAndCommit(new AddTextColumn());
        this.detRef.detectChanges();
    }

    public onDeleteColumn(index: number) {
        this.activePuzzle.updateAndCommit(new DeleteTextColumn(index));
        this.detRef.detectChanges();
    }
    
    public onSaveColumn(index: number) {
        this.activePuzzle.update(new UpdateTextColumn(index, this.form.value.answerCols[index].caption))
        this.detRef.detectChanges();
    }
}
