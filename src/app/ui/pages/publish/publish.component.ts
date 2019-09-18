import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService } from 'src/app/services/publication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { PatchPuzzleInfo } from 'src/app/services/modifiers/patch-puzzle-info';
import { GridParameters } from '../../common';
import { GridPainterService } from '../../services/grid-painter.service';
import { Puzzle } from 'src/app/model/puzzle';
import { promise } from 'protractor';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public form: FormGroup;
    public appStatus: AppStatus;
    public preview: string = "";

    private subs: Subscription[] = [];

    private gridParams: GridParameters = new GridParameters();;

    @ViewChild('canvas', { static: true }) canvasRef: ElementRef;

    constructor(
        private appService: AppService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private publicationService: PublicationService,
        private builder: FormBuilder,
        private gridPainter: GridPainterService) { }

    public ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));

            this.form = this.builder.group({
                'username': ["", Validators.required],
                'password': ["", Validators.required],
            });

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.appService.setBusy();
        this.appService.clearAlerts();

        this.getGridImage()
        .then((image) => {
            return this.publicationService.publishGrid(image, this.puzzle.info.title, this.form.value.username, this.form.value.password)
        })
        .then((gridUrl) => {
            return this.publicationService.publishPost(this.puzzle, gridUrl, this.form.value.username, this.form.value.password)
        })
        .then((postId) => {
            this.activePuzzle.update(new PatchPuzzleInfo(postId));
            this.appService.clearBusy();
            this.router.navigate(["/publish-complete"]);
        })
        .catch(error => {
            this.appService.clearBusy();
            this.appService.setAlert("danger", "ERROR: " + error.toString());
        });
    }

    public onBack() {
        this.appService.clearAlerts();
        this.router.navigate(["/publish-preamble"]);
    }

    private getGridImage(): Promise<string | null> {

        return new Promise<string | null>((resolve, reject) => {
            if (this.puzzle.grid) {
                const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;

                canvas.width = this.gridParams.cellSize * this.puzzle.grid.size.across + this.gridParams.gridPadding * 2;
                canvas.height = this.gridParams.cellSize * this.puzzle.grid.size.down + this.gridParams.gridPadding * 2;

                const context = canvas.getContext('2d');

                this.gridPainter.drawGrid(context, this.puzzle.grid);

                //canvas.toBlob((blob) => resolve(blob));

                const dataUrl = canvas.toDataURL();

                resolve(dataUrl.replace("data:image/png;base64,",""));

            } else {
                resolve(null);
            }
        });
    }
}
