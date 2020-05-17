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
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';

export interface ClueEditModel {
    id: string;
    caption: string;
    group: ClueGroup;
    text: string;
}

@Component({
    selector: 'app-clue-text-editor',
    templateUrl: './clue-text-editor.component.html',
    styleUrls: ['./clue-text-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueTextEditorComponent implements OnInit, AfterViewInit, OnDestroy, IClueEditorForm {
    private subs: Subscription[] = [];
    private instanceId: string = null;

    public form: FormGroup;
    public title = "";
    public clue: ClueEditModel;

    @ViewChild("text", { static: false }) textInput: ElementRef;

    @Input() showHelp: boolean = true;
    @Output() dirty = new EventEmitter<void>();


    constructor(
        private activePuzzle:IActivePuzzle,
        private editorService: ClueEditorService,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit() {
        this.instanceId = this.editorService.register(() => this.onSave());

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

                this.form = this.formBuilder.group({
                    caption: [
                        this.clue ? this.clue.caption : "", 
                        [
                            Validators.required, 
                            Validators.pattern(clueCaptionExpression + String.raw`\s*`)
                        ]
                    ],
                    text: [
                        this.clue ? this.clue.text : "",
                        [ 
                            Validators.required,
                            Validators.pattern(String.raw`^.*` + clueLetterCountExpression),
                        ]
                    ],
                    group: [
                        this.clue ? this.clue.group : "",
                        [
                            Validators.required
                        ]
                    ],
                });
        
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
        this.editorService.unRegister(this.instanceId);
    }

    private onSave(): Promise<boolean> {
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
                new ValidateLetterCounts(),
                new SortClues(),
                //new Clear(),
            );

            this.activePuzzle.update(...mods);
        }
        
        return Promise.resolve(result);
    }
}
