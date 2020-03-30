import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../clue-text-control/clue-text-control.component';
import { AnnotateClue } from 'src/app//modifiers/clue-modifiers/annotate-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { TipInstance, TipStatus } from '../tip/tip-instance';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { ClueValidationWarning, QuillDelta } from 'src/app/model/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Puzzle } from 'src/app/model/puzzle';
import { PuzzleM } from 'src/app//modifiers/mutable-model/puzzle-m';
import { AppSettings } from 'src/app/services/common';
import { PublishOptions } from 'src/app/model/publish-options';
import { Grid } from 'src/app/model/grid';

type AnswerTextKlass = "editorEntry" | "gridEntry" | "placeholder" | "pointing" | "separator" | "clash";

interface AnswerItem {
    index: number,
    id: string;
    caption: string;
    answer: string;
}

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
    //@Input() clueId: string;
    @Input() starterText: string;
    //@Input() publishOptions: PublishOptions;

    @Output() close = new EventEmitter<string>();

    public clue: Clue;
    public form: FormGroup;
    public appSettings: AppSettings;
    public tipInstance: TipInstance;
    public tipStatus: TipStatus = new TipStatus(false, false, false);
    public warnings: ClueValidationWarning[] = [];
    public showAnnotation: boolean = false;
    public latestAnswer: AnswerTextChunk[] = [];
    public publishOptions: PublishOptions;

    public answerItems: AnswerItem[] = [];

    private shadowPuzzle: Puzzle;
    private subs: Subscription[] = [];
    private grid: Grid = null;

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            answers: this.formBuilder.array([]),
            comment: [""],
            chunks: [[]],
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        let selectedClue = puzzle.getSelectedClue();
                        if (selectedClue) {

                            this.shadowPuzzle = this.makeShadowPuzzle(puzzle, selectedClue.id);
                            this.clue = puzzle.clues.find((c) => c.id === selectedClue.id);
                            this.grid = puzzle.grid;
                            this.publishOptions = puzzle.publishOptions;

                            let formArray: FormArray = this.form.get("answers") as FormArray;
                            formArray.clear();
                            this.answerItems = [];

                            puzzle.publishOptions.textCols.forEach((col, index) => {
                                let answerText = "";
                                
                                if (index === 0) {
                                    answerText = this.starterText || this.clue.answers[0];
                                } else if (index < this.clue.answers.length){
                                    answerText = this.clue.answers[index];
                                } else {
                                    answerText = "";
                                }

                                this.answerItems.push({
                                    index,
                                    id: "answer" + index,
                                    caption: col.caption,
                                    answer:  answerText,
                                });
                            });

                            this.form.patchValue({
                                comment: this.clue.comment,
                                answer: this.starterText ? this.starterText : this.clue.answers[0],
                                chunks: this.clue.chunks,
                            });

                            this.answerItems.forEach((item) => {
                                formArray.push(this.formBuilder.control(item.answer));
                            });

                            this.warnings = [];
                            this.clue.warnings.forEach(warning => this.warnings.push(warning));

                            this.setLatestAnswer();
                        }
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

    public get answerControls() {
        return this.form.get('answers') as FormArray;
      }

    public onClearDefinition() {
        this.form.patchValue({
            chunks: [new ClueTextChunk(0, this.clue.text, false)]
        });
        this.validate();
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

        //console.log("FORM " + JSON.stringify(this.form.value));

        if (this.appSettings.general.showCommentEditor.enabled &&
            this.appSettings.tips.definitionWarning.enabled &&
            !this.tipStatus.show &&
            this.form.value.chunks.length < 2) {

            this.tipInstance.activated = true;

        } else {
            let answer = this.clean(this.form.value.answers[0]);
            let lengthAvailable = 0;

            if (this.grid) {
                this.clue.link.entries.forEach(entry => {
                    lengthAvailable += this.grid.getGridEntryFromReference(entry.gridRef).length;
                })
            }
            if (answer && lengthAvailable && answer.length !== lengthAvailable) {
                this.showSaveWarning("Warning: the answer does not fit the space available in the grid");

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
        let answers = this.form.get("answers").patchValue([this.clue.solution]);

        this.validate();
        this.setLatestAnswer();
    }

    public onAnnotation() {
        this.showAnnotation = !this.showAnnotation;
    }

    public onChange() {
        this.validate();
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
                this.clue.id,
                this.form.value.answers,
                this.form.value.comment,
                this.form.value.chunks,
                this.warnings,
            ));
        }
        this.activePuzzle.update(new Clear());
        this.close.emit(save? "save" : "cancel");
    }

    private clean(answer: string): string {
        return answer ?
            answer.toUpperCase().replace(/[^A-Z]/g, "") :
            "";
    }

    private setLatestAnswer(): void {
        let result: AnswerTextChunk[] = [];
        let answer: AnswerTextChunk[] = this.getLatestAnswer(this.grid);
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

    private getLatestAnswer(grid: Grid): AnswerTextChunk[] {
        let result: AnswerTextChunk[] = [];
        let answer = this.clean(this.form.value.answers[0]);
        let index = 0;

        this.clue.link.entries.forEach((entry) => {
            grid.getGridEntryFromReference(entry.gridRef)
            .map(c => c.id)
            .forEach((id) => {
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
            let grid = new Grid(puzzle.grid);

            // clear the grid
            puzzle.grid.cells.forEach(cell => cell.content = "");

            puzzle.clues.forEach((clue) => {
                let answer = null;
                let index = 0;

                if (clue.id !== clueId) {
                    answer = clue.answers[0].toUpperCase().replace(/[^A-Z]/g, "");
                }

                if (answer) {
                    clue.link.entries.forEach((entry) => {
                        grid.getGridEntryFromReference(entry.gridRef)
                        .map(c => c.id)
                        .forEach((id) => {
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

    private validate() {
        this.warnings = Clue.validateAnnotation(
            this.form.value.answers[0],
            this.form.value.comment,
            this.form.value.chunks,
        );
    }
}
