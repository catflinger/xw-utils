import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../clue-text-control/clue-text-control.component';
import { UpdateClue } from 'src/app/services/modifiers/update-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService, AppSettings } from 'src/app/services/app-settings.service';
import { TipInstance, TipStatus } from '../tip/tip-instance';
import { ClearSelection } from 'src/app/services/modifiers/clear-selection';
import { ClueValidationWarning, QuillDelta } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { relativeTimeRounding } from 'moment';

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
    public tipInstance: TipInstance;
    public tipStatus: TipStatus = new TipStatus(false, false, false);
    public warnings: ClueValidationWarning[] = [];
    public showAnnotation: boolean = false;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
    ) { }

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
                        this.warnings = [];
                        clue.warnings.forEach(warning => this.warnings.push(warning));
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
        if (this.tipInstance) {
            this.tipInstance.destroy();
        }
    }

    public onClearDefinition() {
        this.form.patchValue({
            chunks: [new ClueTextChunk(0, this.clue.text, false)]
        });
        this.warnings = this.validate();
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

        if (this.appSettings.general.showCommentEditor.enabled &&
            this.appSettings.tips.definitionWarning.enabled &&
            !this.tipStatus.show &&
            this.form.value.chunks.length < 2) {

            this.tipInstance.activated = true;

        } else {
            let answer = this.form.value.answer;

            if (this.clean(answer).length !== this.clue.lengthAvailable) {
                this.showSaveWarning("Warning: the answer does not fit the space available");

            } else if (this.clue.solution && this.clean(answer) !== this.clean(this.clue.solution)) {
                this.showSaveWarning("Warning: the answer does match the publsihed solution");

            } else {
                this.closeEditor(true);
            }
        }
    }

    public onTipInstance(instance: TipInstance) {
        this.tipInstance = instance;
        this.tipInstance.activated = false;
        this.tipInstance.observe().subscribe(ts => this.tipStatus = ts);
    }

    public onCancel() {
        this.closeEditor(false);
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
        this.warnings = this.validate();
    }

    public onAnnotation() {
        this.showAnnotation = !this.showAnnotation;
    }

    public onChange() {
        this.warnings = this.validate();
    }

    public get showTextWarning() {
        return this.appSettings.general.showCommentEditor.enabled &&
            this.appSettings.general.showCommentValidation.enabled &&
            this.warnings.length &&
            !this.clue.redirect;
    }

    private showSaveWarning(message: string) {
        let lengthDialog = this.modalService.open(ConfirmModalComponent);
        lengthDialog.componentInstance.message = message;
        
        lengthDialog.result.then((result) => { 
            if (result) {
                this.closeEditor(true);
            }
        })
        .catch();
    }

    private closeEditor(save: boolean) {
        if (save) {
            this.activePuzzle.update(new UpdateClue(
                this.clueId,
                this.form.value.answer,
                this.form.value.comment,
                this.form.value.chunks,
                this.warnings,
            ));
        }
        this.activePuzzle.update(new ClearSelection());
        this.close.emit(save? "save" : "cancel");
    }

    private validate(): ClueValidationWarning[] {
        let warnings: ClueValidationWarning[] = [];

        let answer: string = this.form.value.answer;
        let comment: QuillDelta = this.form.value.comment;
        let chunks: readonly TextChunk[] = this.form.value.chunks;

        if (!answer || answer.trim().length === 0) {
            warnings.push("missing answer");
        }

        let commentOK = false;

        if (comment && comment.ops && Array.isArray(comment.ops)) {
            let text = "";

            comment.ops.forEach(op => {
                if (op.insert) {
                    text += op.insert;
                }
            });
            commentOK = text.trim().length > 0;
        }

        if (!commentOK) {
            warnings.push("missing comment");
        }


        let definitionCount = 0;
        chunks.forEach(chunk => {
            if (chunk.isDefinition) {
                definitionCount++;
            }
        })

        if (definitionCount === 0) {
            warnings.push("missing definition");
        }

        return warnings;
    }

    private clean(answer: string): string {
        return answer ?
            answer.toUpperCase().replace(/[^A-Z]/, "") :
            "";
    }
}
