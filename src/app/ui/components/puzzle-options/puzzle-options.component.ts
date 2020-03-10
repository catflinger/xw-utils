import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { UpdatePublsihOptions } from 'src/app//modifiers/publish-options-modifiers/update-publish-options';
import { Subscription } from 'rxjs';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { PublishOptions } from 'src/app/model/publish-options';
import { TextColumn } from 'src/app/model/text-column';
import { AddTextColumn } from 'src/app//modifiers/publish-options-modifiers/add-text-column';
import { DeleteTextColumn } from 'src/app//modifiers/publish-options-modifiers/delete-text-column';
import { UpdateTextColumn } from 'src/app/modifiers/publish-options-modifiers/update-text-column';

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
            "answerCols": new FormArray([]),
            "showCols": new FormControl(false),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            this.colCount = puzzle.publishOptions.textCols.length;

            this.form.patchValue({"showCols": this.colCount > 1});

            this.answerColsArray.clear();
            this.makeControls(puzzle.publishOptions).forEach(control => this.answerColsArray.push(control));
        }));
    }

    private makeControls(publishOptions: PublishOptions): FormGroup[] {
        let controls: FormGroup[] = [];

        publishOptions.textCols.forEach(col => {
            //console.log("ADDING CONTROL " + col.caption);
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
