import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../clue-text-control/clue-text-control.component';
import { UpdateClue } from 'src/app/services/modifiers/update-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { TipInstance } from '../tip/tip.component';
import { AppSettings } from 'src/app/services/common';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit, OnDestroy {
    @Input() clueId: string;
    @Input() starterText: string;
    @Input() latestAnswer: string;

    @Output() close = new EventEmitter<string>();

    public clue: Clue;
    public form: FormGroup;
    public appSettings: AppSettings;
    public tip: TipInstance;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            answer: [""],
            comment: [""],
            chunks: [[]],
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        let clue = puzzle.clues.find((c) => c.id === this.clueId);
                        this.clue = clue;

                        this.form.patchValue({
                            comment: clue.comment,
                            answer: this.starterText ? this.starterText : clue.answer,
                            chunks: clue.chunks,
                        });
                    }
                }
            )
        );

        this.subs.push(
            this.appSettingsService.observe().subscribe(settings => {
                this.appSettings = settings;
            }));
}

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onClearDefinition() {
        this.form.patchValue({
            chunks: [new ClueTextChunk(0, this.clue.text, false)]
        });
    }

    public hasDefinition(): boolean {
        let definitionCount = 0;
        this.form.value.chunks.forEach((chunk: ClueTextChunk) => {
            if (chunk.isDefinition) {
                definitionCount++;
            } 
         });
         return definitionCount > 0;
    }
    
    public onSave() {

        if (!this.tip.hasBeenShown && this.form.value.chunks.length < 2) {
            this.tip.open();
        } else {
            this.activePuzzle.update(new UpdateClue(
                this.clueId,
                this.form.value.answer,
                this.form.value.comment,
                this.form.value.chunks
            ));

            this.close.emit("save");
        }
    }

    public onTipInstance(instance: TipInstance) {
        this.tip = instance;
    }

    public onCancel() {
        this.close.emit("cancel");
    }

    public showLatestAnswer(): boolean {
        return this.latestAnswer && /_+/.test(this.latestAnswer);
    }

    public onToggleComment() {
        this.appSettingsService.toggleCommentEditor();
    }

    public onCheat() {
        this.form.patchValue({
            answer: this.clue.solution,
        });
    }
}
