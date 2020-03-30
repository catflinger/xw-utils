import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clue } from 'src/app/model/clue';
import { FormGroup, FormControl } from '@angular/forms';
import { UpdatePuzzleOptions } from 'src/app/modifiers/publish-options-modifiers/update-puzzle-options';

@Component({
    selector: 'app-grid-linker',
    templateUrl: './grid-linker.component.html',
    styleUrls: ['./grid-linker.component.css']
})
export class GridLinkerComponent implements OnInit {
    private subs: Subscription[] = [];

    public clue: Clue;
    public form: FormGroup;

    constructor(
        private activePuzzle:IActivePuzzle,
    ) { }

    public ngOnInit() {

        this.form = new FormGroup({
            "setGridRefsFromCaptions": new FormControl(true),
        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.form.patchValue({"setGridRefsFromCaptions": puzzle.options.setGridRefsFromCaptions});
                this.clue = puzzle.getSelectedClue();
                //console.log("CLUE: " + JSON.stringify(this.clue))
            }
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onChangeGridRefs() {
        //this.activePuzzle.update(new UpdatePuzzleOptions(this.form.value.setGridRefsFromCaptions));
    }

}
