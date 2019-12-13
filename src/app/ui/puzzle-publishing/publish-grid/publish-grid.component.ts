import { Component, OnInit, ViewChild } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Router, ChildActivationStart } from '@angular/router';
import { GridCell } from 'src/app/model/grid-cell';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { ClearShading } from 'src/app/services/modifiers/clear-shading';
import { DownloadInstance } from '../../components/download-button/download-button.component';
import { AppService } from '../../services/app.service';
import { GridComponent } from '../../components/grid/grid.component';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';

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
        this.activePuzzle.update(new UpdateCell(cell.id, { shading: color }));
    }

    public onContinue() {
        this.appService.clear();
        this.navService.navigate("continue");
    }

    public onBack() {
        this.appService.clear();
        this.navService.navigate("back");
    }

    public onClearAll() {
        this.appService.clear();
        this.activePuzzle.update(new ClearShading());
    }

    public onDownload(instance: DownloadInstance) {
        this.appService.clear();
        instance.download("grid-image.png", this.gridControl.getDataUrl());
    }

}
