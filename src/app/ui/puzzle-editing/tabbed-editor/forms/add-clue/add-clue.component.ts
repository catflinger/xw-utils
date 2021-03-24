import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { FormGroup, FormBuilder, Validators, Validator, ValidatorFn } from '@angular/forms';
import { clueCaptionExpression, clueLetterCountExpression } from 'src/app/services/parsing/text/types';
import { AddClue } from 'src/app/modifiers/clue-modifiers/add-clue';
import { SortClues } from 'src/app/modifiers/clue-modifiers/sort-clues';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { v4 as uuid } from "uuid";
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';
import { EditorFormBase } from '../editor-form-base';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { CaptionStyle } from 'src/app/model/interfaces';

@Component({
  selector: 'app-add-clue',
  templateUrl: './add-clue.component.html',
  styleUrls: ['./add-clue.component.css']
})
export class AddClueComponent extends EditorFormBase implements OnInit {
    private subs: Subscription[] = [];

    public form: FormGroup;
    public  puzzle: Puzzle;
    public letters: string[];

    @Output() close = new EventEmitter<void>();

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        editorService: ClueEditorService,
    ) { 
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            caption: "",
            text: [
                "",
                [ 
                    Validators.required,
                    Validators.pattern(String.raw`^.*` + clueLetterCountExpression),
                ]
            ],
            group: [
                "across",
                [
                    Validators.required
                ]
            ],
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {
                this.puzzle = puzzle;
                if (puzzle) {
                    this.form.get("caption").setValidators(this.getCaptionValidators(puzzle.provision.captionStyle));
                }
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onAddClue() {
        const id = uuid();

        this.activePuzzle.update(
            new AddClue(
                this.form.value.caption,
                this.form.value.group,
                this.form.value.text,
                id,
            ),
            new SetGridReferences([id]),
            new SetRedirects(),
            new SortClues(),
            );
        this.close.emit();
    }

    private getCaptionValidators(clueStyle: CaptionStyle): ValidatorFn[] {
        let captionExpression: string;

        if (clueStyle === "alphabetical") {
            captionExpression = String.raw`^\s*[A-Z]\s+`;
        } else if (clueStyle === "none") {
            captionExpression = String.raw`^\s*`;
        } else {
            captionExpression = clueCaptionExpression;
        }

        return [Validators.required, Validators.pattern(captionExpression + String.raw`\s*`)]
    }
}
