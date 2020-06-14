import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { UpdateCell } from 'src/app/modifiers/grid-modifiers/update-cell';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { RenumberGid } from 'src/app/modifiers/grid-modifiers/renumber-grid';
import { ClueEditorService } from '../../clue-editor.service';
import { BarClickEvent } from 'src/app/ui/grid/grid/grid.component';
import { EditorFormBase } from '../editor-form-base';

@Component({
    selector: 'app-grid-form',
    templateUrl: './grid-form.component.html',
    styleUrls: ['./grid-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFormComponent extends EditorFormBase implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private puzzle: Puzzle;

   @Output() dirty = new EventEmitter<void>();

    constructor(
        private activePuzzle:IActivePuzzle,
        editorService: ClueEditorService,
    ) { 
        super(editorService)
    }

    public ngOnInit() {

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            this.puzzle = puzzle;
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
            );
        }
    }
}
