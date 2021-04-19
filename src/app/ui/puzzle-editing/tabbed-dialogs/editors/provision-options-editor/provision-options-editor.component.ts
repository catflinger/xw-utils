import { Component, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UpdateProvision } from 'src/app/modifiers/puzzle-modifiers/update-provision';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';

@Component({
    selector: 'app-provision-options-editor',
    templateUrl: './provision-options-editor.component.html',
    styleUrls: ['./provision-options-editor.component.css']
})
export class ProvisionOptionsEditorComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public form: FormGroup;
    
    constructor(
        private activePuzzle: IActivePuzzle,
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            options: {}
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {
                if (puzzle) {
                    this.form.get("options").patchValue(puzzle.provision, { emitEvent: false });
                } else {
                    this.form.get("options").setValue({}, { emitEvent: false });
                }
            })
        );

        this.subs.push(this.form.valueChanges.subscribe((changes: SimpleChange) => {
            this.activePuzzle.updateAndCommit(new UpdateProvision(this.form.value.options))
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

}
