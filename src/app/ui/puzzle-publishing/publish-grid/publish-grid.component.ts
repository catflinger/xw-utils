import { Component, OnInit, ViewChild } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { ClearShading } from 'src/app//modifiers/grid-modifiers/clear-shading';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { GridComponent } from '../../grid/grid/grid.component';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';

@Component({
  selector: 'app-publish-grid',
  templateUrl: './publish-grid.component.html',
  styleUrls: ['./publish-grid.component.css']
})
export class PublishGridComponent implements OnInit {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];
    public color: string;

    @ViewChild(GridComponent, { static: false }) 
    public gridControl: GridComponent;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle, 
    ) { }

    public ngOnInit() {
        // TO DO: record preferences for next time
        this.color = "#ffebcd";

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
            ));
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCellClick(cell: GridCell) {
        this.appService.clear();
        // overwrite if a new color, clear if the same color
        let color: string = cell.shading && cell.shading === this.color ? null : this.color;
        this.activePuzzle.updateAndCommit(new UpdateCell(cell.id, { shading: color }));
    }

    public onContinue() {
        this.appService.clear();
        this.navService.navigate("continue");
    }

    public onBack() {
        this.appService.clear();
        this.navService.navigate("back");
    }

    public onDownload() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("image");
    }

    public onClearAll() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new ClearShading());
    }
}
