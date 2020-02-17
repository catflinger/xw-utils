import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateClue } from 'src/app/services/modifiers/update-clue';
import { ClueListAction } from '../clue-list-item/clue-list-item.component';

@Component({
    selector: 'app-clue-text-editor',
    templateUrl: './clue-text-editor.component.html',
    styleUrls: ['./clue-text-editor.component.css']
})
export class ClueTextEditorComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    private subs: Subscription[] = [];

    @Input() clue: Clue;
    @Output() close = new EventEmitter<void>();

    constructor(
        private activePuzzle:IActivePuzzle,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit() {
        this.form = this.formBuilder.group({
            caption: [this.clue.caption, Validators.required],
            text: [this.clue.text, Validators.required],
            letterCount: [this.clue.letterCount, Validators.required],
        });
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSave() {
        this.activePuzzle.update(new UpdateClue(
            this.clue.id, 
            this.form.value.caption,
            this.form.value.text,
        ));
        this.close.emit();
    }

    public onCancel() {
        this.close.emit();
    }
}
