import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IClueEditor, ClueEditorInstance } from '../../clue-editor/clue-editor.component';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { UpdateCell } from 'src/app/modifiers/grid-modifiers/update-cell';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { RenumberGid } from 'src/app/modifiers/grid-modifiers/renumber-grid';
import { BarClickEvent } from '../../../grid/grid.component';

@Component({
    selector: 'app-grid-form',
    templateUrl: './grid-form.component.html',
    styleUrls: ['./grid-form.component.css']
})
export class GridFormComponent implements OnInit, OnDestroy, IClueEditor {
    private subs: Subscription[] = [];
    private puzzle: Puzzle;

    @Output() instance = new EventEmitter<ClueEditorInstance>();
    @Output() dirty = new EventEmitter<void>();

    constructor(
        //private editorService: ClueEditorService,
        private activePuzzle:IActivePuzzle,
    ) { }

    public ngOnInit() {

        this.instance.emit({ 
            //confirmClose: () => false,
            save: (): Promise<boolean> => {
                return this.onSave();
            },
         });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            this.puzzle = puzzle;

            if (puzzle) {
            }
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
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

    private onSave(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

