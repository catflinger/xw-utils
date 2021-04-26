import { v4 as uuid } from "uuid";
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClueDialogService } from '../../clue-dialog.service';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';
import { ClueEditValue } from "../../editors/clue-editor-control/clue-editor-control.component";
import { UpdateClue } from 'src/app//modifiers/clue-modifiers/update-clue';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';
import { ValidateLetterCounts } from 'src/app/modifiers/clue-modifiers/validate-letter-counts';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { Clue } from "src/app/model/puzzle-model/clue";
import { UpdateProvision } from "src/app/modifiers/puzzle-modifiers/update-provision";

@Component({
    selector: 'app-edit-clue-form',
    templateUrl: './edit-clue-form.component.html',
    styleUrls: ['./edit-clue-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClueFormComponent extends TabbedDialogFormBase implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public form: FormGroup;
    public clue: Clue = null;

    @Input() showHelp: boolean = true;
    @Output() dirty = new EventEmitter<void>();

    constructor(
        private activePuzzle:IActivePuzzle,
        private formBuilder: FormBuilder,
        editorService: ClueDialogService,
        private changeRef: ChangeDetectorRef,
    ) {
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            edits: {},
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.clue = puzzle.getSelectedClue();

                if (this.clue) {
                    const edits: ClueEditValue = 
                    {
                        caption: this.clue.caption,
                        text: this.clue.text,
                        group: this.clue.group,
                        options: {
                            hasLetterCount: puzzle.provision.hasLetterCount,
                            hasClueGroupHeadings: puzzle.provision.hasClueGroupHeadings,
                            captionStyle: puzzle.provision.captionStyle,
                        }
                    };
                    this.form.get("edits").setValue(edits);
                }
            } else {
                this.clue = null;
            }
            this.changeRef.detectChanges();
        }));

        this.subs.push(this.form.valueChanges.subscribe(x => {
            if (this.form.dirty) {
                this.dirty.emit();
            }
        }));

    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        super.ngOnDestroy();
    }

    protected onSave() {
        let result: boolean = false;


        if (this.clue) {

            this.activePuzzle.updateAndCommit(
                new UpdateProvision(this.form.value.edits.options),
                new UpdateClue({
                    id: this.clue.id, 
                    caption: this.form.value.edits.caption,
                    group: this.form.value.edits.group,
                    text: this.form.value.edits.text,
                }),
                new SetGridReferences([this.clue.id]),
                new SetRedirects(),
                new ValidateLetterCounts(),
                new SortClues(),
                //new Clear(),
            );
        }

        return Promise.resolve(result);
    }
}
