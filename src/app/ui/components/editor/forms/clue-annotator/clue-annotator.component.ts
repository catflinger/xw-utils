import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../../../clue-text-control/clue-text-control.component';
import { AnnotateClue } from 'src/app//modifiers/clue-modifiers/annotate-clue';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { TipInstance, TipStatus } from '../../../tip/tip-instance';
import { ClueValidationWarning, IPuzzle } from 'src/app/model3/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { Puzzle } from 'src/app/model/puzzle';
import { AppSettings } from 'src/app/services/common';
import { PublishOptions } from 'src/app/model/publish-options';
import { Grid } from 'src/app/model/grid';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';

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
export class ClueAnnotationComponent implements OnInit, AfterViewInit, OnDestroy, IClueEditorForm {

    @Output() dirty = new EventEmitter<void>();

    @ViewChildren("answer", { read: ElementRef }) children: QueryList<ElementRef>;

    public grid: Grid = null;
    public clue: Clue;
    public form: FormGroup;
    public appSettings: AppSettings;
    public tipInstance: TipInstance;
    public tipStatus: TipStatus = new TipStatus(false, false, false);
    public warnings: ClueValidationWarning[] = [];
    public showAnnotation: boolean = false;
    public latestAnswer: AnswerTextChunk[] = [];
    public publishOptions: PublishOptions;

    private shadowPuzzle: Puzzle;
    private subs: Subscription[] = [];
    private instanceId: string = null;

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private editorService: ClueEditorService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
    ) { }

    public ngOnInit() {

        this.instanceId = this.editorService.register(() => this.onSave());

        this.form = this.formBuilder.group({
            answers: this.formBuilder.array([]),
            comment: [""],
            chunks: [[]],
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        this.clue = puzzle.getSelectedClue();
                        if (this.clue) {

                            this.shadowPuzzle = this.makeShadowPuzzle(puzzle, this.clue.id);

                            this.grid = puzzle.grid;
                            this.publishOptions = puzzle.publishOptions;

                            let formArray: FormArray = this.form.get("answers") as FormArray;
                            formArray.clear();

                            puzzle.publishOptions.textCols.forEach((col, index) => {
                                let answerText = "";
                                
                                if (index < this.clue.answers.length){
                                    answerText = this.clue.answers[index];
                                } else {
                                    answerText = "";
                                }

                                formArray.push(
                                    this.formBuilder.group({
                                        id: ["answer" + index],
                                        caption: [col.caption],
                                        answer: [answerText],
                                    })
                                );
                            });

                            this.form.patchValue({
                                comment: this.clue.comment,
                                chunks: this.clue.chunks,
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

        this.subs.push(this.form.valueChanges.subscribe(x => {
            if (this.form.dirty) {
                this.dirty.emit();
            }
        }));
    }

    public ngAfterViewInit() {
        if (this.children.length) {
            this.children.first.nativeElement.focus();
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        if (this.tipInstance) {
            this.tipInstance.destroy();
        }
        this.editorService.unRegister(this.instanceId);
    }

    public trackAnsersBy(index) {
        return index;
    }

    public get clueCaption(): string {
        let result = "";

        if (this.clue) {
            result = this.clue.caption;

            if (!/(across|down)/i.test(this.clue.caption)) {
                result += " " + this.clue.group;
            }
        }

        return result;
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

    public onTipInstance(instance: TipInstance) {
        this.tipInstance = instance;
        this.tipInstance.activated = false;
        this.tipInstance.observe().subscribe(ts => this.tipStatus = ts);
    }

    public onCheat() {
        const formArray = this.form.get("answers") as FormArray;
        formArray[0].patchValue({ answer: this.clue.solution });

        this.validate();
        this.setLatestAnswer();
    }

    public onAnnotation() {
        this.showAnnotation = !this.showAnnotation;
    }

    public onChange(index: number) {
        if (index === 0) {
            this.validate();
            this.setLatestAnswer();
        }
    }

    public get showTextWarning() {
        return this.appSettings.general.showCommentValidation.enabled &&
            this.warnings.length &&
            !this.clue.redirect;
    }

    private onSave(): Promise<boolean> {
        let result = Promise.resolve(true);

        if (!this.form.dirty) {

            result = Promise.resolve(false);

        } else {
            if (this.appSettings.tips.definitionWarning.enabled &&
                !this.tipStatus.show &&
                this.form.value.chunks.length < 2) {

                this.tipInstance.activated = true;

            } else {
                let answer = this.clean(this.form.value.answers[0].answer);
                let lengthAvailable = 0;

                if (this.grid) {
                    this.clue.link.entries.forEach(entry => {
                        let ge = this.grid.getGridEntryFromReference(entry.gridRef);
                        if (ge) {
                            lengthAvailable += ge.length;
                        }
                    })
                }

                if (answer && lengthAvailable && answer.length !== lengthAvailable) {
                    result = this.showSaveWarning("Warning: the answer does not fit the space available in the grid")
                        .then((cancel): boolean => {
                            if (!cancel) {
                                this.save();
                            }
                            return cancel;
                        });
                } else if (this.clue.solution && answer !== this.clean(this.clue.solution)) {
                    result = this.showSaveWarning("Warning: the answer does match the publsihed solution")
                        .then((cancel): boolean => {
                            if (!cancel) {
                                this.save();
                            }
                            return cancel;
                        });
                } else {
                    this.save();
                    result = Promise.resolve(false);
                }
            }
        }

        return result;
    }

    private showSaveWarning(message: string): Promise<boolean> {
        let lengthDialog = this.modalService.open(ConfirmModalComponent);
        lengthDialog.componentInstance.message = message;
        
        return lengthDialog.result;
    }

    private save() {
        let answers = this.form.value.answers.map(item => item.answer)

        this.activePuzzle.update(
            new AnnotateClue(
                this.clue.id,
                answers,
                this.form.value.comment,
                this.form.value.chunks,
                this.warnings,
            ),
        );
    }

    private clean(answer: string): string {
        return answer ?
            answer.toUpperCase().replace(/[^A-Z]/g, "") :
            "";
    }

    private setLatestAnswer(): void {
        let result: AnswerTextChunk[] = [];
        let answerChunks: AnswerTextChunk[] = this.getLatestAnswer(this.grid);
        let format = this.clue.format;
        let formatIndex = 0;
        let answerChunkIndex = 0;

        while (formatIndex < format.length) {
            if (format[formatIndex] === ",") {
                if (answerChunkIndex < answerChunks.length) {
                    result.push(answerChunks[answerChunkIndex]);
                    answerChunkIndex++;
                } else {
                    result.push(new AnswerTextChunk("_", "placeholder"));
                }
            } else {
                result.push(new AnswerTextChunk(format[formatIndex], "separator"));
            }
            formatIndex++;
        }

        while (answerChunkIndex < answerChunks.length) {
            result.push(answerChunks[answerChunkIndex]);
            answerChunkIndex++;
        }

        this.latestAnswer = result;
    }

    private getLatestAnswer(grid: Grid): AnswerTextChunk[] {
        let result: AnswerTextChunk[] = [];
        let answer = this.clean(this.form.value.answers[0].answer);
        let index = 0;

        this.clue.link.entries.forEach((entry) => {
            let ge = grid.getGridEntryFromReference(entry.gridRef);

            if (ge) {
                ge.map(c => c.id)
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
                });
            }
        });

        return result;
    }

    // this function takes the model and creates a copy set to the state the original would have been
    // if the current clue had not yet been attempted
    private makeShadowPuzzle(original: Puzzle, clueId: string): Puzzle {
        let puzzle = JSON.parse(JSON.stringify(original)) as IPuzzle;

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
            this.form.value.answers[0].answer,
            this.form.value.comment,
            this.form.value.chunks,
        );
    }
}
