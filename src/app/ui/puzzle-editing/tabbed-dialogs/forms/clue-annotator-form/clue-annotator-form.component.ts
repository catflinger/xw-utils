import { Component, OnInit, OnDestroy, Output, EventEmitter, ElementRef, AfterViewInit, ViewChildren, QueryList, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Subscription } from 'rxjs';
import { ClueTextChunk } from '../../../../clues/clue-text-control/clue-text-control.component';
import { AnnotateClue } from 'src/app//modifiers/clue-modifiers/annotate-clue';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { TipInstance, TipStatus } from '../../../../general/guides/tip/tip-instance';
import { ClueValidationWarning, IPuzzle } from 'src/app/model/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../general/confirm-modal/confirm-modal.component';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { AppSettings } from 'src/app/services/common';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { ClueDialogService } from '../../clue-dialog.service';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';

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
    selector: 'app-clue-annotator-form',
    templateUrl: './clue-annotator-form.component.html',
    styleUrls: ['./clue-annotator-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueAnnotatorFormComponent extends TabbedDialogFormBase implements OnInit, AfterViewInit, OnDestroy {

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
    public puzzle: Puzzle;
    
    private shadowPuzzle: Puzzle;
    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        editorService: ClueDialogService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private detRef: ChangeDetectorRef,
    ) { 
        super(editorService)
    }

    public get answersFormArray(): FormArray {
        return this.form.get("answers") as FormArray;
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            answers: this.formBuilder.array([]),
            comment: [""],
            chunks: [[]],
        });

        this.subs.push(
            this.form.valueChanges.subscribe(() => {
                this.setLatestAnswer();
                //this.detRef.detectChanges();
            })
        );

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    this.puzzle = puzzle;
                    this.clue = null;

                    if (puzzle) {
                        this.clue = puzzle.getSelectedClue();
                        if (this.clue) {

                            this.shadowPuzzle = this.makeShadowPuzzle(puzzle, this.clue.id);

                            this.grid = puzzle.grid;

                            this.answersFormArray.clear();

                            puzzle.publishOptions.textCols.forEach((col, index) => {
                                let answerText = "";
                                
                                if (index  === 0) {
                                    const key = this.editorService.lastKeyPress.take();
                                    answerText = key ? key : this.clue.answers[0];
                                
                                } else if (index < this.clue.answers.length){
                                    answerText = this.clue.answers[index];
                                
                                } else {
                                    answerText = "";
                                }

                                this.answersFormArray.push(
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
                    this.detRef.detectChanges();
                }
            )
        );

        this.subs.push(
            this.appSettingsService.observe().subscribe(settings => {
                this.appSettings = settings;
                this.detRef.detectChanges();
            }));

        this.subs.push(this.form.valueChanges.subscribe(x => {
            if (this.form.dirty) {
                this.dirty.emit();
            }
            this.detRef.detectChanges();
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
        super.ngOnDestroy();
    }

    public trackAnswersBy(index) {
        return index;
    }

    public onClearDefinition() {
        this.form.patchValue({
            chunks: [new ClueTextChunk(0, this.clue.text, false)]
        });
        this.form.markAsDirty();
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
        this.subs.push(this.tipInstance.observe().subscribe(ts => {
            this.tipStatus = ts;
            this.detRef.detectChanges();
        }));
    }

    public onCheat() {
        this.answersFormArray.controls[0].patchValue({ answer: this.clue.solution });
        this.form.markAsDirty();

        this.validate();
        this.setLatestAnswer();
        this.dirty.emit();
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

    protected onSave(): Promise<boolean> {
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
 
                    this.clue.link.gridRefs.forEach(gridRef => {
                        let ge = this.grid.getGridEntryFromReference(gridRef);
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
                            this.detRef.detectChanges();
                            return cancel;
                        });
                } else if (this.clue.solution && answer !== this.clean(this.clue.solution)) {
                    result = this.showSaveWarning("Warning: the answer does match the publsihed solution")
                        .then((cancel): boolean => {
                            if (!cancel) {
                                this.save();
                            }
                            this.detRef.detectChanges();
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
            answer.toUpperCase().replace(/[^A-Z?]/g, "") :
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
        const answers = this.form.value.answers;

        if (Array.isArray(answers) && answers.length > 0) {

            let answer = this.clean(answers[0].answer);
            let index = 0;

            this.clue.link.gridRefs.forEach((gridRef) => {
                let ge = grid.getGridEntryFromReference(gridRef);

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
            });
        }
        
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
                    answer = clue.answers[0].toUpperCase().replace(/[^A-Z?]/g, "");
                }

                if (answer) {
                    clue.link.gridRefs.forEach((gridRef) => {
                        grid.getGridEntryFromReference(gridRef)
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
