import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { FormGroup, FormBuilder, Validators, Validator, ValidatorFn } from '@angular/forms';
import { AddClue } from 'src/app/modifiers/clue-modifiers/add-clue';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { v4 as uuid } from "uuid";
import { ClueDialogService } from '../../clue-dialog.service';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { ClueEditValue } from '../../editors/clue-editor-control/clue-editor-control.component';
import { UpdateProvision } from 'src/app/modifiers/puzzle-modifiers/update-provision';

const defaultValue: ClueEditValue = {
    text: "",
    caption: "",
    group: "across",
    options: {
        hasClueGroupHeadings: true,
        hasLetterCount: true,
        captionStyle: "numbered",
    }
}

@Component({
  selector: 'app-add-clue-form',
  templateUrl: './add-clue-form.component.html',
  styleUrls: ['./add-clue-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddClueFormComponent extends TabbedDialogFormBase implements OnInit {
    private subs: Subscription[] = [];

    public form: FormGroup;
    public  puzzle: Puzzle;
    public letters: string[];
    public showAdvancedOptions = false;

    @Output() close = new EventEmitter<void>();

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        editorService: ClueDialogService,
    ) { 
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            edits: defaultValue,
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {
                this.puzzle = puzzle;
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onAddClue() {
        const id = uuid();

        this.activePuzzle.updateAndCommit(
            new UpdateProvision(this.edits.options),
            new AddClue(
                this.edits.caption,
                this.edits.group,
                this.edits.text,
                id,
            ),
            new SetGridReferences([id]),
            new SetRedirects(),
            new SortClues(),
        );
        this.close.emit();
    }

    private get edits(): ClueEditValue {
        return this.form.value.edits;
    }


}
