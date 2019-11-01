import { Component, OnInit, OnDestroy } from '@angular/core';
import { v4 as uuid } from "uuid";
import { AppSettingsService, AppSettings, BooleanSettingsGroupKey } from 'src/app/services/app-settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/ui/services/app.service';
import { GridStyles } from "../../../model/interfaces";
import { PuzzleM } from 'src/app/services/modifiers/mutable-model/puzzle-m';
import { Puzzle } from 'src/app/model/puzzle';
import { GridCellM } from 'src/app/services/modifiers/mutable-model/grid-cell-m';
import { GridCell } from 'src/app/model/grid-cell';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';

@Component({
    selector: 'app-grid-start',
    templateUrl: './grid-start.component.html',
    styleUrls: ['./grid-start.component.css']
})
export class GridStartComponent implements OnInit {
    public settings: AppSettings;
    public readonly minCellsAcross = 1;
    public readonly minCellsDown = 1;
    public readonly maxCellsAcross = 25;
    public readonly maxCellsDown = 25;
    

    private subs: Subscription[] = [];
    public form: FormGroup;

        constructor(
        private appService: AppService,
        private settingsService: AppSettingsService,
        private puzzleService: IPuzzleManager,
        private formBuilder: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {

        this.settings = this.settingsService.settings;

        this.form = this.formBuilder.group({
            title: [
                "", 
                [Validators.required]],
            
            gridStyle: [
                GridStyles.standard, 
                [Validators.required]],

            cellsAcross: [
                15, 
                [Validators.required, Validators.max(this.maxCellsAcross), Validators.min(this.minCellsAcross)]],

            cellsDown: [
                15, 
                [Validators.required, Validators.max(this.maxCellsDown), Validators.min(this.minCellsDown)]],
        });

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings;
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.puzzleService.addPuzzle(this.createGrid());
        this.router.navigate(["/grid-editor"]);
    }

    public onCancel() {
        this.router.navigate(["/home"]);
    }

    private createGrid(): Puzzle {
        let cells: GridCellM[] = [];
        const cellsAcross: number = this.form.value.cellsAcross;
        const cellsDown: number = this.form.value.cellsAcross;

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
                };
                cells.push(cell);
            }
        }

        let data: PuzzleM = {
            linked: false,
            //solveable: false,
            version: null,
            createdWithVersion: null,
            revision:0,
            
            info: {
                id: uuid(),
                title: this.form.value.title,
                provider: null,
                setter: null,
                wordpressId: null,
                puzzleDate: new Date(),
                blogable: false,
                solveable:false,
                gridable: true,
            },
            notes: {
                header: null,
                body: null,
                footer: null,
            },
            grid: {
                style: this.form.value.gridStyle,
                size: {
                    across: cellsAcross,
                    down: cellsDown,
                },
                cells: cells,
            },
            clues: null,
            publishOptions: {
                answerStyle: null,
                clueStyle: null,
                definitionStyle: null,
                layout: null,
                includeGrid: true,
            },
        }

        return new Puzzle(data);
    }
}
