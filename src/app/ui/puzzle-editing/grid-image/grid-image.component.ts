import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridControlOptions, GridEditors } from '../../common';
import { GridEditor } from '../../grid/grid-editors/grid-editor';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { GridComponent } from '../../grid/grid/grid.component';

@Component({
  selector: 'app-grid-image',
  templateUrl: './grid-image.component.html',
  styleUrls: ['./grid-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridImageComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public form: FormGroup;
    public options: GridControlOptions = { editor: GridEditors.cellEditor, hideShading: true };

    public dataUrl: string;
    public filename: string;

    @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;
    @ViewChild(GridComponent, { static: false }) gridControl: GridComponent;

    private subs: Subscription[] = [];

    private gridEditor: GridEditor;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            encoding: ["png"],
            filename: ["grid-image"],
            caption: [""],
        });

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            if (!puzzle.grid) {
                                this.navService.goHome();
                            }
                            this.form.patchValue({title: puzzle.info.title});
                        }
                        this.puzzle = puzzle;
                        this.detRef.detectChanges();
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onClose() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    public onDownload() {
        this.filename = "grid-image.png";
        this.dataUrl = this.gridControl.getDataUrl();

        setTimeout(
            () => {
                this.downloadLink.nativeElement.click();
            },
            250
        );
    }

}
