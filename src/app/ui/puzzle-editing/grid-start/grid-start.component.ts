import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridCellM } from 'src/app//modifiers/mutable-model/grid-cell-m';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { AddGrid } from 'src/app//modifiers/grid-modifiers/add-grid';
import { Grid } from 'src/app/model/grid';
import { GridProperties } from 'src/app/model/grid-properties';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridStyles } from 'src/app/model/interfaces';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-grid-start',
    templateUrl: './grid-start.component.html',
    styleUrls: ['./grid-start.component.css']
})
export class GridStartComponent implements OnInit, OnDestroy {
    public readonly minCellsAcross = 1;
    public readonly minCellsDown = 1;
    public readonly maxCellsAcross = 25;
    public readonly maxCellsDown = 25;   

    public form: FormGroup;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        private puzzleManager: IPuzzleManager,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {

        this.form = this.formBuilder.group({
            title: ["", Validators.required],
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
            ]
        });
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCancel() {
        this.navService.goHome();
    }

    public onContinue() {

        let grid = this.createGrid({
            style: this.form.value.gridStyle,
            size: {
                across: this.form.value.cellsAcross,
                down: this.form.value.cellsDown,
            },
            symmetrical: this.form.value.symmetrical,
        });

        this.puzzleManager.newPuzzle(this.navService.appData.provider, [
            new AddGrid({ grid }), 
            new UpdateInfo({ 
                title: this.form.value.title,
                provider: this.appService.openPuzzleParameters.provider,
                gridable: true,
            }),
        ]);

        this.navService.navigate("continue");
    }

    private createGrid(params: GridProperties): Grid {
        let cells: GridCellM[] = [];
        const cellsAcross = params.size.across;
        const cellsDown = params.size.down;

        for(let x = 0; x < cellsAcross; x++) {
            for(let y = 0; y < cellsDown; y++) {
                let cell: GridCellM = {
                    id: `cell-${x}-${y}`,
                    x,
                    y,
                    caption: "",
                    content: "",
                    light: true,
                    rightBar: false,
                    bottomBar: false,
                    highlight: false,
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
