import { Component, OnInit, Type, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { FormGroup, FormControl } from '@angular/forms';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { ClueEditorService } from '../../clue-editor.service';

@Component({
    selector: 'app-grid-linker',
    templateUrl: './grid-linker.component.html',
    styleUrls: ['./grid-linker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridLinkerComponent implements OnInit, IClueEditorForm {
    private subs: Subscription[] = [];
    private instanceId: string = null;

    @Output() dirty = new EventEmitter<void>();

    public clue: Clue;
    public form: FormGroup;

    constructor(
        private activePuzzle:IActivePuzzle,
        private editorService: ClueEditorService,
    ) { }

    public ngOnInit() {
        this.instanceId = this.editorService.register(() => Promise.resolve(false));

         this.form = new FormGroup({
            "setGridRefsFromCaptions": new FormControl({
                value: true,
                disabled: true
            }),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.form.patchValue({"setGridRefsFromCaptions": puzzle.options.setGridRefsFromCaptions});
                this.clue = puzzle.getSelectedClue();
            }
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        this.editorService.unRegister(this.instanceId);
    }

    public onChangeGridRefs() {
        // TO DO:
    }
}
