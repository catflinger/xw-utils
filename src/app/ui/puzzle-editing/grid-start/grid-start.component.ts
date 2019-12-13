import { Component, OnInit, OnDestroy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { GridCellM } from 'src/app/services/modifiers/mutable-model/grid-cell-m';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { AddGrid } from 'src/app/services/modifiers/add-grid';
import { Grid } from 'src/app/model/grid';
import { GridProperties } from 'src/app/model/grid-properties';

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

    public onClose(result: GridProperties) {
        if (result) {
            let grid = this.createGrid(result);
            this.activePuzzle.update(new AddGrid({ grid }));
            this.navService.navigate("continue");
        } else {
            this.navService.goHome();
        }
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
