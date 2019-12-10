import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuzzleM } from 'src/app/services/modifiers/mutable-model/puzzle-m';
import { Puzzle } from 'src/app/model/puzzle';
import { GridCellM } from 'src/app/services/modifiers/mutable-model/grid-cell-m';
import { IPuzzleManager, IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { GridPropertiesArgs } from '../../components/grid-properties-editor/grid-properties-editor.component';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-start',
    templateUrl: './grid-start.component.html',
    styleUrls: ['./grid-start.component.css']
})
export class GridStartComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private navService: NavService<AppTrackData>,
        private puzzleService: IPuzzleManager,
    ) { }

    ngOnInit() {
        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    this.puzzle = puzzle;
                }
        ));
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onClose(result: GridPropertiesArgs) {
        if (result) {
            this.puzzleService.addPuzzle(this.createGrid(result));
            this.navService.navigate("continue");
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
            //version: null,
            //createdWithVersion: null,
            revision:0,

            info: {
                id: "foo", //uuid(),
                title: params.title,
                provider: null,
                setter: null,
                wordpressId: null,
                puzzleDate: new Date(),
                blogable: false,
                solveable:false,
                gridable: true,
                //ready: false,
                source: null,
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
