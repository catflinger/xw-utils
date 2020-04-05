import { Component, OnInit, OnDestroy, Output, EventEmitter, Type, Input } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { PublishOptions } from 'src/app/model/publish-options';
import { AddTextColumn } from 'src/app//modifiers/publish-options-modifiers/add-text-column';
import { DeleteTextColumn } from 'src/app//modifiers/publish-options-modifiers/delete-text-column';
import { UpdateTextColumn } from 'src/app/modifiers/publish-options-modifiers/update-text-column';
import { ClueEditorService } from '../clue-editor.service';
import { ClueEditorComponentName } from '../editor-component.factory';

@Component({
    selector: 'app-puzzle-options',
    templateUrl: './puzzle-options.component.html',
    styleUrls: ['./puzzle-options.component.css']
})
export class PuzzleOptionsComponent implements OnInit, OnDestroy {
    public form: FormGroup;

    @Output() public edit = new EventEmitter<void>();
    @Input() public clueId: string;

    private subs: Subscription[] = [];

    constructor(
        private editorService: ClueEditorService,
        private activePuzzle: IActivePuzzle,
    ) { }

    public get answerColsArray(): FormArray {
        return this.form.get("answerCols") as FormArray;
    }
    public ngOnInit() {

        console.log("INIT PuzzleOptionsComponent");

        this.form = new FormGroup({
            "answerCols": new FormArray([]),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.answerColsArray.clear();
                this.makeControls(puzzle.publishOptions).forEach(control => this.answerColsArray.push(control));
            }
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
    }

    public onEdit() {
        this.edit.emit();
    }

    public onAddColumn() {
        this.activePuzzle.updateAndCommit(new AddTextColumn());
    }

    public onDeleteColumn(index: number) {
        this.activePuzzle.updateAndCommit(new DeleteTextColumn(index));
    }
    
    public onSaveColumn(index: number) {
        this.activePuzzle.updateAndCommit(new UpdateTextColumn(index, this.form.value.answerCols[index].caption))
    }
    
    public onNav(nextComponent: ClueEditorComponentName) {
        // TO DO: check for unsaved changes here and warn the user before navigating
        this.editorService.open(this.clueId, null, nextComponent);
    }

    public onCancel() {
        this.editorService.close();
    }
}
