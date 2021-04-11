import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UpdateProvision } from 'src/app/modifiers/puzzle-modifiers/update-provision';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { ClueEditorService } from '../../clue-editor.service';
import { EditorFormBase } from '../editor-form-base';

@Component({
    selector: 'app-clue-options-form',
    templateUrl: './clue-options-form.component.html',
    styleUrls: ['./clue-options-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueOptionsFormComponent extends EditorFormBase implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public form: FormGroup;

    constructor(
        private activePuzzle:IActivePuzzle,
        private formBuilder: FormBuilder,
        editorService: ClueEditorService,
    ) {
        super(editorService)
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            options: null,
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.form.patchValue({ options: puzzle.provision}, {emitEvent: false});
            }
        }));

        this.subs.push(this.form.valueChanges.subscribe(changes => {
            this.activePuzzle.updateAndCommit(new UpdateProvision(changes.options));
        }));
    }

}
