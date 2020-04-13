import { Component, OnInit, Type, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clue } from 'src/app/model/clue';
import { FormGroup, FormControl } from '@angular/forms';
import { IClueEditor, ClueEditorInstance } from '../../clue-editor/clue-editor.component';

@Component({
    selector: 'app-grid-linker',
    templateUrl: './grid-linker.component.html',
    styleUrls: ['./grid-linker.component.css']
})
export class GridLinkerComponent implements OnInit, IClueEditor {
    private subs: Subscription[] = [];

    @Output() instance = new EventEmitter<ClueEditorInstance>();
    @Output() dirty = new EventEmitter<void>();

    public clue: Clue;
    public form: FormGroup;

    constructor(
        private activePuzzle:IActivePuzzle,
    ) { }

    public ngOnInit() {

        this.instance.emit({ 
            //confirmClose: () => false,
            save: (): Promise<boolean> => {
                return Promise.resolve(false);
            },
         });


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
    }

    public onChangeGridRefs() {
        // TO DO:
    }
}
