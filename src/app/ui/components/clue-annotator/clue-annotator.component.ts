import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../clue-text-control/clue-text-control.component';
import { AnnotateClue } from 'src/app/services/modifiers/annotate-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { TipInstance, TipStatus } from '../tip/tip-instance';
import { Clear } from 'src/app/services/modifiers/clear';
import { ClueValidationWarning, QuillDelta } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Puzzle } from 'src/app/model/puzzle';
import { PuzzleM } from 'src/app/services/modifiers/mutable-model/puzzle-m';
import { AppSettings } from 'src/app/services/common';

type AnswerTextKlass = "editorEntry" | "gridEntry" | "placeholder" | "pointing" | "separator" | "clash";

class AnswerTextChunk {
    constructor(
        public readonly letter: string,
        public readonly klass: AnswerTextKlass,
    ) {}

    public toString(): string {
        return this.letter;
    }
}

@Component({
    selector: 'app-clue-annotator',
    templateUrl: './clue-annotator.component.html',
    styleUrls: ['./clue-annotator.component.css']
})
export class ClueAnnotationComponent implements OnInit, OnDestroy {
    @Input() clueId: string;
    @Input() starterText: string;

    @Output() close = new EventEmitter<string>();

    public clue: Clue;
    public form: FormGroup;
    public appSettings: AppSettings;
    public tipInstance: TipInstance;
    public tipStatus: TipStatus = new TipStatus(false, false, false);
    public warnings: ClueValidationWarning[] = [];
    public showAnnotation: boolean = false;
    public latestAnswer: AnswerTextChunk[] = [];

    //private puzzle: Puzzle;
    private shadowPuzzle: Puzzle;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
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
                        this.shadowPuzzle = this.makeShadowPuzzle(puzzle, this.clueId);

                        this.clue = puzzle.clues.find((c) => c.id === this.clueId);

                        this.form.patchValue({
                            comment: this.clue.comment,
                            answer: this.starterText ? this.starterText : this.clue.answer,
                            chunks: this.clue.chunks,
                        });
                        this.warnings = [];
                        this.clue.warnings.forEach(warning => this.warnings.push(warning));

                        this.setLatestAnswer();
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
            let answer = this.clean(this.form.value.answer);

            if (answer && answer.length !== this.clue.lengthAvailable) {
                this.showSaveWarning("Warning: the answer does not fit the space available");

            } else if (this.clue.solution && answer !== this.clean(this.clue.solution)) {
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

    public onToggleComment() {
        this.appSettingsService.toggleCommentEditor();
    }

    public onCheat() {
        this.form.patchValue({
            answer: this.clue.solution,
        });
        this.warnings = this.validate();
        this.setLatestAnswer();
    }

    public onAnnotation() {
        this.showAnnotation = !this.showAnnotation;
    }

    public onChange() {
        this.warnings = this.validate();
        this.setLatestAnswer();
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
            this.activePuzzle.update(new AnnotateClue(
                this.clueId,
                this.form.value.answer,
                this.form.value.comment,
                this.form.value.chunks,
                this.warnings,
            ));
        }
        this.activePuzzle.update(new Clear());
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
            answer.toUpperCase().replace(/[^A-Z]/g, "") :
            "";
    }

    private setLatestAnswer(): void {
        let result: AnswerTextChunk[] = [];
        let answer: AnswerTextChunk[] = this.getLatestAnswer();
        let format = this.clue.format;
        let formatIndex = 0;
        let answerIndex = 0;

        while (formatIndex < format.length) {
            if (format[formatIndex] === ",") {
                if (answerIndex < answer.length) {
                    result.push(answer[answerIndex]);
                    answerIndex++;
                } else {
                    result.push(new AnswerTextChunk("_", "placeholder"));
                }
            } else {
                result.push(new AnswerTextChunk(format[formatIndex], "separator"));
            }
            formatIndex++;
        }

        while (answerIndex < answer.length) {
            result.push(answer[answerIndex]);
            answerIndex++;
        }

        this.latestAnswer = result;
    }

    private getLatestAnswer(): AnswerTextChunk[] {
        let result: AnswerTextChunk[] = [];
        let answer = this.clean(this.form.value.answer);
        let index = 0;

        this.clue.entries.forEach((entry) => {
            entry.cellIds.forEach((id) => {
                let cell = this.shadowPuzzle.grid.cells.find((cell) => cell.id === id);

                // choose in order of preference:
                //     - a letter from the answer
                //     - a letter from the grid
                //     - a placeholder

                let letter = "_";
                let klass: AnswerTextKlass = "placeholder";

                let gridEntry = cell.content && cell.content.trim().length > 0 ? cell.content : null;
                let editorEntry = answer.length > index ? answer.charAt(index) : null;

                if (!gridEntry) {
                    if (editorEntry) {
                        letter = editorEntry;
                        klass = "editorEntry";
                    }
                } else {
                    if (editorEntry && gridEntry !== editorEntry) {
                        letter = editorEntry;
                        klass = "clash";
                    } else {
                        letter = gridEntry;
                        klass = "gridEntry";
                    }
                }

                result.push(new AnswerTextChunk(letter, klass));
                index++;
            })
        });

        return result;
    }

    // this function takes the model and creates a copy set to the state the original would have been
    // if the current clue had not yet been attempted
    private makeShadowPuzzle(original: Puzzle, clueId: string): Puzzle {
        let puzzle = JSON.parse(JSON.stringify(original)) as PuzzleM;

        if (puzzle.grid) {

            // clear the grid
            puzzle.grid.cells.forEach(cell => cell.content = "");

            puzzle.clues.forEach((clue) => {
                let answer = null;
                let index = 0;

                if (clue.id !== clueId) {
                    answer = clue.answer.toUpperCase().replace(/[^A-Z]/g, "");
                }

                if (answer) {
                    clue.entries.forEach((entry) => {
                        entry.cellIds.forEach((id) => {
                            let cell = puzzle.grid.cells.find(c => c.id === id);
                            if (index < answer.length) {
                                cell.content = answer.charAt(index);
                            }
                            index++;
                        });
                    });
                }
            });
        }

        return new Puzzle(puzzle);
    }
}
