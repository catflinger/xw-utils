import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { GridComponent } from '../../grid/grid/grid.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-grid-image',
  templateUrl: './grid-image.component.html',
  styleUrls: ['./grid-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridImageComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public form: FormGroup;

    public dataUrl: string;
    public filename: string;

    @ViewChild(GridComponent, { static: false }) gridControl: GridComponent;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            encoding: [
                this.appService.recentlyUsed.downloadEncoding, 
                Validators.required],
            filename: [
                this.appService.recentlyUsed.downloadFilename, 
                [
                    Validators.required, 
                    Validators.pattern(/^[ a-z0-9-]+$/i)
                ]
            ],
            caption: 
                this.appService.recentlyUsed.downloadCaption,
        });

        this.subs.push(
             this.form.get("caption").valueChanges
            .pipe(
                debounceTime(200)
            )
            .subscribe(change => {
                this.gridControl.caption = change;
                this.detRef.detectChanges();
            })
        );
        
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
                )
            );
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
        this.appService.clear();

        this.filename = `${this.form.value.filename}.${this.form.value.encoding}`;
        this.dataUrl = this.gridControl.getDataUrl(this.form.value.encoding);

        if (this.dataUrl === "data;") {
            this.appService.setAlert("danger", `Your browser is unable to create an image of this grid.`);

        } else if (this.dataUrl.startsWith("data:image/png") && this.form.value.encoding !== "png") {
            this.appService.setAlert("danger", `Saving as ${this.form.value.encoding} is not available on your browser.  Try another encoding.`)

        } else {
            this.appService.recentlyUsed.downloadCaption = this.form.value.caption;
            this.appService.recentlyUsed.downloadEncoding = this.form.value.encoding;
            this.appService.recentlyUsed.downloadFilename = this.form.value.filename;

            setTimeout(
                () => {
                    this.downloadFile(this.dataUrl, this.form.value.filename);
                    this.appService.setAlert("info", `The image is being downloaded.  Look in your to your browser's downloads folder.`);
                },
                250
            );
        }
    }

    private downloadFile(url: string, fileName: string): void {
        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.href = url;
        downloadLink.click();
     }
}
