import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from "uuid";
import { PuzzleM } from 'src/app/services/modifiers/mutable-model/puzzle-m';
import { Puzzle } from 'src/app/model/puzzle';
import { GridCellM } from 'src/app/services/modifiers/mutable-model/grid-cell-m';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { GridPropertiesArgs } from '../../components/grid-properties-editor/grid-properties-editor.component';
import { NavService } from '../../navigation/nav.service';

@Component({
    selector: 'app-grid-start',
    templateUrl: './grid-start.component.html',
    styleUrls: ['./grid-start.component.css']
})
export class GridStartComponent implements OnInit {

    constructor(
        private navService: NavService,
        private puzzleService: IPuzzleManager,
    ) { }

    ngOnInit() {
    }

    public onClose(result: GridPropertiesArgs) {
        if (result) {
            this.puzzleService.addPuzzle(this.createGrid(result));
            this.navService.goNext("continue");
        } else {
            this.navService.goHome();
        }
    }

    private createGrid(params: GridPropertiesArgs): Puzzle {
        let cells: GridCellM[] = [];
        const cellsAcross = params.properties.size.across;
        const cellsDown = params.properties.size.down;

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

        let data: PuzzleM = {
            linked: false,
            version: null,
            createdWithVersion: null,
            revision:0,

            info: {
                id: uuid(),
                title: params.title,
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
                properties: params.properties,
                cells: cells,
            },
            clues: null,
            publishOptions: {
                answerStyle: null,
                clueStyle: null,
                definitionStyle: null,
                layout: null,
                includeGrid: true,
                spacing: null,
            },
        }

        return new Puzzle(data);
    }
}
