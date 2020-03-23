import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { PublishOptions } from 'src/app/model/publish-options';
import { AddTextColumn } from 'src/app//modifiers/publish-options-modifiers/add-text-column';
import { DeleteTextColumn } from 'src/app//modifiers/publish-options-modifiers/delete-text-column';
import { UpdateTextColumn } from 'src/app/modifiers/publish-options-modifiers/update-text-column';
import { UpdatePuzzleOptions } from 'src/app/modifiers/publish-options-modifiers/update-puzzle-options';

@Component({
    selector: 'app-puzzle-options',
    templateUrl: './puzzle-options.component.html',
    styleUrls: ['./puzzle-options.component.css']
})
export class PuzzleOptionsComponent implements OnInit, OnDestroy {
    public showOptions = false;
    public colCount = 0;
    public form: FormGroup;

    @Output() public edit = new EventEmitter<void>();

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
    ) { }

    public get answerColsArray(): FormArray {
        return this.form.get("answerCols") as FormArray;
    }
    public ngOnInit() {
        this.form = new FormGroup({
            "setGridRefsFromCaptions": new FormControl(true),
            "answerCols": new FormArray([]),
            "showCols": new FormControl(false),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {

                this.form.patchValue({"setGridRefsFromCaptions": puzzle.options.setGridRefsFromCaptions});

                this.colCount = puzzle.publishOptions.textCols.length;
                this.form.patchValue({"showCols": this.colCount > 1});

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

    public onPuzzleOptions() {
        this.showOptions = !this.showOptions;
    }

    public onChangeGridRefs() {
        this.activePuzzle.update(new UpdatePuzzleOptions(this.form.value.setGridRefsFromCaptions));
    }

    public onEdit() {
        this.edit.emit();
    }

    public onAddColumn() {
        this.activePuzzle.update(new AddTextColumn());
    }

    public onDeleteColumn(index: number) {
        this.activePuzzle.update(new DeleteTextColumn(index));
    }
    
    public onSaveColumn(index: number) {
        this.activePuzzle.update(new UpdateTextColumn(index, this.form.value.answerCols[index].caption))
    }
}
