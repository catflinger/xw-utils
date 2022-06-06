import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPuzzleManager, IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { AddGrid } from 'src/app//modifiers/grid-modifiers/add-grid';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { GridProperties } from 'src/app/model/puzzle-model/grid-properties';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridStyles, IGridCell } from 'src/app/model/interfaces';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { AppService } from '../../general/app.service';
import { RenumberGid } from 'src/app/modifiers/grid-modifiers/renumber-grid';
import { SetGridCaptions } from 'src/app/modifiers/grid-modifiers/set-grid-captions';

@Component({
    selector: 'app-grid-start',
    templateUrl: './grid-start.component.html',
    styleUrls: ['./grid-start.component.css']
})
export class GridStartComponent implements OnInit, OnDestroy {
    public readonly minCellsAcross = 1;
    public readonly minCellsDown = 1;
    public readonly maxCellsAcross = 30;
    public readonly maxCellsDown = 30;

    public form: FormGroup;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        public activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {

        this.form = this.formBuilder.group({
            title: [
                "",
                [Validators.required]
            ],

            gridStyle: [
                GridStyles.standard, 
                [Validators.required]
            ],

            cellsAcross: [
                15, 
                [
                    Validators.required, 
                    Validators.max(this.maxCellsAcross), 
                    Validators.min(this.minCellsAcross)
                ]
            ],

            cellsDown: [
                15, 
                [
                    Validators.required, 
                    Validators.max(this.maxCellsDown), 
                    Validators.min(this.minCellsDown)
                ]
            ],

            symmetrical : [
                true,
                [Validators.required],
            ],

            numbered : [
                true,
                [Validators.required],
            ]

        });

        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.form.patchValue({title: puzzle.info.title});
            } else {
                this.form.patchValue({title: ""});
            }
        }));
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCancel() {
        this.navService.navigate("cancel");
    }

    public onContinue() {

        let grid = this.createGrid({
            style: this.form.value.gridStyle,
            size: {
                across: this.form.value.cellsAcross,
                down: this.form.value.cellsDown,
            },
            symmetrical: this.form.value.symmetrical,
            numbered: this.form.value.numbered,
            showCaptions: true,
        });

        if (this.activePuzzle.hasPuzzle) {
            this.activePuzzle.updateAndCommit(
                new AddGrid({ grid }),
                new RenumberGid(),
                new SetGridCaptions(),
            );
        } else {
            this.puzzleManager.newPuzzle("grid", [
                new AddGrid({grid}),
                new UpdateInfo({title: this.form.value.title}),
                new RenumberGid(),
                new SetGridCaptions(),
            ]);
        }

        this.navService.navigate("continue");
    }

    private createGrid(params: GridProperties): Grid {
        let cells: IGridCell[] = [];
        const cellsAcross = params.size.across;
        const cellsDown = params.size.down;

        for(let x = 0; x < cellsAcross; x++) {
            for(let y = 0; y < cellsDown; y++) {
                let cell: IGridCell = {
                    id: `cell-${x}-${y}`,
                    x,
                    y,
                    anchor: null,
                    caption: null,
                    content: "",
                    light: true,
                    rightBar: false,
                    bottomBar: false,
                    highlight: false,
                    hidden: false,
                    shading: null,
                    edit: false,
                };
                cells.push(cell);
            }
        }

        return new Grid({
            properties: params,
            cells: cells,
        });
    }
}
