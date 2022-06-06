import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IClueEditorForm } from '../../clue-dialog/clue-dialog.component';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { UpdateCell } from 'src/app/modifiers/grid-modifiers/update-cell';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { RenumberGid } from 'src/app/modifiers/grid-modifiers/renumber-grid';
import { ClueDialogService } from '../../clue-dialog.service';
import { BarClickEvent } from 'src/app/ui/grid/grid/grid.component';
import { TabbedDialogFormBase } from '../tabbed-dialog-form-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateGridProperties } from 'src/app/modifiers/grid-modifiers/updare-grid-properties';
import { UpdatePublsihOptions } from 'src/app/modifiers/publish-options-modifiers/update-publish-options';
import { SetGridCaptions } from 'src/app/modifiers/grid-modifiers/set-grid-captions';

@Component({
    selector: 'app-grid-form',
    templateUrl: './grid-form.component.html',
    styleUrls: ['./grid-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFormComponent extends TabbedDialogFormBase implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private puzzle: Puzzle;
    
    public form: FormGroup;

   @Output() dirty = new EventEmitter<void>();

    constructor(
        editorService: ClueDialogService,
        private activePuzzle:IActivePuzzle,
        private changeRef: ChangeDetectorRef,
        private fb: FormBuilder,
    ) { 
        super(editorService)
    }

    public ngOnInit() {
        this.form = this.fb.group({ showGridCaptions: false });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            this.puzzle = puzzle;
            if (puzzle) {
                this.form.patchValue({ showGridCaptions: puzzle.grid.properties.showCaptions}, { emitEvent: false });
                this.changeRef.detectChanges();
            }
        }));

        this.subs.push(this.form.valueChanges.subscribe(val => {
            this.activePuzzle.updateAndCommit(
                new UpdateGridProperties({showCaptions: val.showGridCaptions}),
            );
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        super.ngOnDestroy();
    }

    public onCellClick(cell: GridCell) {
        if (this.puzzle.grid.properties.style === "standard") {

            this.activePuzzle.update(
                new UpdateCell(cell.id, { light: !cell.light}),
                new RenumberGid(),
                new SetGridCaptions(),
            );
        }
    }

    public onBarClick(event: BarClickEvent) {
        if (this.puzzle.grid.properties.style === "barred") {
            const barData = event.bar === "rightBar" ? 
                { rightBar: !event.cell.rightBar } :
                { bottomBar: !event.cell.bottomBar };

            this.activePuzzle.update(
                new UpdateCell(event.cell.id, barData),
                new RenumberGid(),
                new SetGridCaptions(),
            );
        }
    }
}

