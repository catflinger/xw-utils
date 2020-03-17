import { v4 as uuid } from "uuid";
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateClue } from 'src/app//modifiers/clue-modifiers/update-clue';
import { ClueGroup } from 'src/app/model/interfaces';
import { AddClue } from 'src/app//modifiers/clue-modifiers/add-clue';
import { clueCaptionExpression, clueLetterCountExpression } from 'src/app/services/parsing/text/types';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { LinkCluesToGrid } from 'src/app/modifiers/clue-modifiers/link-clues-to-grid';
import { unescapeIdentifier } from '@angular/compiler';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';

export interface ClueEditModel {
    id: string;
    caption: string;
    group: ClueGroup;
    text: string;
}

@Component({
    selector: 'app-clue-text-editor',
    templateUrl: './clue-text-editor.component.html',
    styleUrls: ['./clue-text-editor.component.css']
})
export class ClueTextEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    private subs: Subscription[] = [];

    public form: FormGroup;
    public title = "";

    @Input() clue: ClueEditModel;
    @Output() close = new EventEmitter<void>();
    
    @ViewChild("text", { static: true }) textInput: ElementRef;

    constructor(
        private activePuzzle:IActivePuzzle,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit() {
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

    public ngAfterViewInit() {
        this.textInput.nativeElement.focus();
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSave() {
        //TO DO: validate teh entry
        if (this.clue) {
            this.activePuzzle.update(
                new UpdateClue(
                    this.clue.id, 
                    this.form.value.caption,
                    this.form.value.group,
                    this.form.value.text,
                ),
                new SetGridReferences([this.clue.id]),
                new LinkCluesToGrid(),
                new SortClues(),
            );
        } else {
            const clueId = uuid();
            this.activePuzzle.update(
                new AddClue(
                    this.form.value.caption,
                    this.form.value.group,
                    this.form.value.text,
                    clueId,
                ),
                new SetGridReferences([clueId]),
                new LinkCluesToGrid(clueId),
                new SortClues(),
            );
        }
        this.close.emit();
    }

    public onCancel() {
        this.close.emit();
    }
}
