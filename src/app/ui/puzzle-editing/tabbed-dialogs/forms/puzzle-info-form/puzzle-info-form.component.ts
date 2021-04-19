import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { UpdateInfo } from 'src/app/modifiers/puzzle-modifiers/update-info';
import { ClueDialogService } from '../../clue-dialog.service';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';

@Component({
    selector: 'app-puzzle-info-form',
    templateUrl: './puzzle-info-form.component.html',
    styleUrls: ['./puzzle-info-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuzzleInfoFormComponent extends TabbedDialogFormBase implements OnInit, OnDestroy {
    public form: FormGroup;

    @Input() public clueId: string;
    @Output() close = new EventEmitter<void>();

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        editorService: ClueDialogService,
    ) { 
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            title: ["", Validators.required],
            setter: ["", Validators.required],
            instructions: ["", Validators.required],
            date: ["", Validators.required],
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.form.patchValue({ 
                    title: puzzle.info.title,
                    setter: puzzle.info.setter,
                    instructions: puzzle.info.instructions ? puzzle.info.instructions : "",
                    date: puzzle.info.puzzleDate,
                });
            }
            this.detRef.detectChanges();
        }));
    }

    public  ngOnDestroy() {
        this.subs.forEach(s => s .unsubscribe());
        super.ngOnDestroy();
    }

    public onSave(): Promise<boolean> {
        this.activePuzzle.updateAndCommit(new UpdateInfo({
            title: this.form.value.title,
            setter: this.form.value.setter,
            instructions: this.form.value.instructions,
            puzzleDate: this.form.value.date,
        }));

        this.close.emit();

        return Promise.resolve(false);
    }

    public onCancel() {
        this.close.emit();
    }

}
