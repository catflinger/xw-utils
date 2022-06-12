import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { from, Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { ClearShading } from 'src/app//modifiers/grid-modifiers/clear-shading';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { GridComponent } from '../../grid/grid/grid.component';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { distinct, filter, map, toArray } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cssColorNameFromValue} from "../../puzzle-publishing/color-control/colors";

@Component({
    selector: 'app-publish-grid',
    templateUrl: './publish-grid.component.html',
    styleUrls: ['./publish-grid.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublishGridComponent implements OnInit {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];
    public colorsUsed: string[] = [];
    public form: FormGroup;
    public cssColorNameFromValue = cssColorNameFromValue;

    @ViewChild(GridComponent, { static: false })
    public gridControl: GridComponent;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private fromBuilder: FormBuilder,
        private changeRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.fromBuilder.group({ color: "#ffebcd"});

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;

                        from(puzzle.grid.cells)
                        .pipe(
                            map(cell => cell.shading),
                            filter(color => !!color),
                            distinct(),
                            toArray()
                        ).subscribe(colors => {
                            this.colorsUsed = colors;
                            this.changeRef.detectChanges();
                        });

                        this.changeRef.detectChanges();

                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCellClick(cell: GridCell) {
        this.appService.clear();
        // overwrite if a new color, clear if the same color
        let color: string = cell.shading && cell.shading === this.form.value.color ? null : this.form.value.color;
        if (cell.light) {
            this.activePuzzle.updateAndCommit(new UpdateCell(cell.id, { shading: color }));
        }
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

    public onClone() {
        this.appService.clear();
        this.activePuzzle.cloneAsGrid();
        this.appService.setAlert("info", 'A copy of the grid has been saved under the "Saved Grids" heading on this page');
        this.navService.goHome();
    }

    public onClearAll() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new ClearShading());
    }

    public onColorUsed(color: string) {
        this.form.patchValue({color});
    }

}
