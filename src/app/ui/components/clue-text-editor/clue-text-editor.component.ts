import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateClue } from 'src/app/services/modifiers/clue-modifiers/update-clue';
import { ClueGroup } from 'src/app/model/interfaces';
import { AddClue } from 'src/app/services/modifiers/clue-modifiers/add-clue';

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
            caption: [this.clue ? this.clue.caption : "", Validators.required],
            text: [this.clue ? this.clue.text : "", Validators.required],
            group: [this.clue ? this.clue.group : "", Validators.required],
        });
    }

    public ngAfterViewInit() {
        this.textInput.nativeElement.focus();
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSave() {
        if (this.clue) {
            this.activePuzzle.update(new UpdateClue(
                this.clue.id, 
                this.form.value.caption,
                this.form.value.group,
                this.form.value.text,
            ));
        } else {
            this.activePuzzle.update(new AddClue(
                this.form.value.caption,
                this.form.value.group,
                this.form.value.text,
            ));
        }
        this.close.emit();
    }

    public onCancel() {
        this.close.emit();
    }
}
