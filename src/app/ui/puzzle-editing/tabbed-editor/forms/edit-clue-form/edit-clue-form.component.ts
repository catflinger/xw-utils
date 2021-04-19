import { v4 as uuid } from "uuid";
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Type, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateClue } from 'src/app//modifiers/clue-modifiers/update-clue';
import { ClueGroup } from 'src/app/model/interfaces';
import { AddClue } from 'src/app//modifiers/clue-modifiers/add-clue';
import { clueCaptionExpression, clueLetterCountExpression } from 'src/app/services/parsing/text/types';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';
import { ValidateLetterCounts } from 'src/app/modifiers/clue-modifiers/validate-letter-counts';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { ClueEditorService } from '../../clue-editor.service';
import { EditorFormBase } from '../editor-form-base';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { ClueValidators } from "../clue-validators";

export interface ClueEditModel {
    id: string;
    caption: string;
    group: ClueGroup;
    text: string;
}

@Component({
    selector: 'app-edit-clue-form',
    templateUrl: './edit-clue-form.component.html',
    styleUrls: ['./edit-clue-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClueFormComponent extends EditorFormBase implements OnInit, AfterViewInit, OnDestroy {
    private subs: Subscription[] = [];

    public form: FormGroup;
    public title = "";
    public clue: ClueEditModel;
    public showAdvancedOptions: false;

    @ViewChild("text", { static: false }) textInput: ElementRef;

    @Input() showHelp: boolean = true;
    @Output() dirty = new EventEmitter<void>();


    constructor(
        private activePuzzle:IActivePuzzle,
        private formBuilder: FormBuilder,
        editorService: ClueEditorService,
    ) {
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            caption: "",
            text: "",
            group: "",
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                let selectedClue = puzzle.getSelectedClue();

                if (selectedClue) {
                    this.clue = {
                        id: selectedClue.id,
                        caption: selectedClue.caption,
                        group: selectedClue.group,
                        text: selectedClue.text,
                    }
                }

                this.title = this.clue ? "new clue" : "edit clue";

                this.form.patchValue({
                    caption: this.clue ? this.clue.caption : "", 
                    text: this.clue ? this.clue.text : "",
                    group: this.clue ? this.clue.group : "",
                });

                this.form.get("caption").setValidators(ClueValidators.getCaptionValidators(puzzle.provision.captionStyle));
                this.form.get("caption").updateValueAndValidity();

                this.form.get("text").setValidators(ClueValidators.getTextValidators(puzzle.provision.hasLetterCount));
                this.form.get("text").updateValueAndValidity();
            }
        }));

        this.subs.push(this.form.valueChanges.subscribe(x => {
            if (this.form.dirty) {
                this.dirty.emit();
            }
        }));

    }

    public ngAfterViewInit() {
        this.textInput.nativeElement.focus();
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        super.ngOnDestroy();
    }

    protected onSave(): Promise<boolean> {
        let result: boolean = false;

        let mods: IPuzzleModifier[] = [];

        if (this.form.dirty) {
           
            // TO DO: validate the entry
            // return result = true if validation fails
            
            if (this.clue) {
                mods.push(
                    new UpdateClue({
                        id: this.clue.id, 
                        caption: this.form.value.caption,
                        group: this.form.value.group,
                        text: this.form.value.text,
                    })
                );

            } else {
                const clueId = uuid();
                mods.push(
                    new AddClue(
                        this.form.value.caption,
                        this.form.value.group,
                        this.form.value.text,
                        clueId)
                );
            }

            mods.push(
                new SetGridReferences([this.clue.id]),
                new SetRedirects(),
                new ValidateLetterCounts(),
                new SortClues(),
                //new Clear(),
            );

            this.activePuzzle.update(...mods);
        }
        
        return Promise.resolve(result);
    }
}
