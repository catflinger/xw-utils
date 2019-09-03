import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueUpdate } from 'src/app/services/clue-update';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { FormBuilder, FormGroup, ControlValueAccessor } from '@angular/forms';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';

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

    private subs: Subscription[] = [];

    constructor(
        private puzzleService: PuzzleService, 
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            answer: [""],
            comment: [""],
            definition: [""]
        });

        this.subs.push(
            this.puzzleService.getObservable().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        let clue = puzzle.clues.find((c) => c.id === this.clueId);
                        this.clue = clue;

                        this.form.patchValue({
                            comment: clue.comment,
                            answer: this.starterText ? this.starterText : clue.answer,
                            definition: clue.definition,
                        });
                    }
                }
            )
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onSave() {
        this.puzzleService.updateClue(
            this.clueId,
            new ClueUpdate(
                this.form.value.definition,
                this.form.value.answer,
                this.form.value.comment
            )
        );
        this.close.emit("save");
    }

    public onCancel() {
        this.close.emit("cancel");
    }

    public showLatestAnswer(): boolean {
        return this.latestAnswer && /_+/.test(this.latestAnswer);
    }
}
