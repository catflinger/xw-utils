import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService } from 'src/app/services/publication.service';
import { AppStatus, AppService } from 'src/app/ui/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { PatchPuzzleInfo } from 'src/app/services/modifiers/patch-puzzle-info';
import { GridParameters } from '../../common';
import { GridPainterService } from '../../services/grid-painter.service';
import { Puzzle } from 'src/app/model/puzzle';
import { ApiResponseStatus, ApiSymbols, PublishStatus } from 'src/app/services/common';
import { AuthService } from 'src/app/services/auth.service';

type PublishActions = "nothing" | "upload" | "publish" | "copy-post" | "copy-grid" | "replace-post" | "replace-grid";

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public alreadyPublished = false;
    public action: PublishActions = "nothing";

    private subs: Subscription[] = [];
    private gridParams: GridParameters = new GridParameters();

    @ViewChild('canvas', { static: true }) canvasRef: ElementRef;

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private publicationService: PublicationService,
        private gridPainter: GridPainterService) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);

        } else if (!this.authService.getCredentials().authenticated) {
            this.router.navigate(["/publish-login"]);

        } else {
            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        this.alreadyPublished = !!puzzle.info.wordpressId;
                        if (!this.alreadyPublished) {
                            this.action = "upload";
                        }
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

        // TO DO: link the media on WP to the post id
        // 1. first create a post with placeholder content, get back the post id
        // 2. upload media with post id, get back url of image
        // 3. update post with actual content incluidng the image url

        switch (this.action) {
            case "upload":
                this.publishPost("draft");
                break;
            case "publish":
                this.publishPost("publish");
                break;
            case "copy-grid":
                this.publishGrid();
                break;
            case "copy-post":
                this.publishPost("draft");
                break;
            case "replace-grid":
                this.appService.clearBusy();
                this.appService.setAlert("info", "Sorry, this feature is still work in progress, we hope to have it finished soon.")
                break;
            case "replace-post":
                this.appService.clearBusy();
                this.appService.setAlert("info", "Sorry, this feature is still work in progress, we hope to have it finished soon.")
                break;
            default:
                // do nothing
                this.appService.clearBusy();
                break;
        }
    }

    public get hasCredentials(): boolean {
        return this.authService.getCredentials() !== null;
    }

    public onBack() {
        this.router.navigate(["/publish-preamble"]);
    }

    private getGridImage(): Promise<string | null> {

        if (!this.puzzle.publishOptions.includeGrid) {
            return Promise.resolve(null);

        } else {
            return new Promise<string | null>((resolve, reject) => {
                if (this.puzzle.grid) {
                    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;

                    canvas.width = this.gridParams.cellSize * this.puzzle.grid.properties.size.across + this.gridParams.gridPadding * 2;
                    canvas.height = this.gridParams.cellSize * this.puzzle.grid.properties.size.down + this.gridParams.gridPadding * 2;

                    const context = canvas.getContext('2d');

                    this.gridPainter.drawGrid(context, this.puzzle.grid, { readonly: true, showShading: true });

                    const dataUrl = canvas.toDataURL();

                    resolve(dataUrl.replace("data:image/png;base64,", ""));

                } else {
                    resolve(null);
                }
            });
        }
    }

    private publishPost(status: PublishStatus) {
        this.getGridImage()
        .then((image) => {
            if (image) {
                //publish the grid
                return this.publicationService.publishGrid(image, this.puzzle.info.title);
            } else {
                // no grid to publish, return a dummy response
                return Promise.resolve({
                    success: ApiResponseStatus.OK,
                    url: null,
                    message: null,
                })
            }
        })
        .then((result) => {
            if (result.success === ApiResponseStatus.OK) {
                return this.publicationService.publishPost(this.puzzle, result.url, status);
            } else if (result.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw new Error(result.message);
            }
        })
        .then((result) => {
            if (result.success === ApiResponseStatus.OK) {
                this.activePuzzle.update(new PatchPuzzleInfo(result.wordpressId));
                this.appService.clearBusy();
                this.router.navigate(["/publish-complete"]);
            } else if (result.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.appService.setAlert("danger", "Username or password incorrect");
                this.authService.clearCredentials();
                this.router.navigate(["/publish-login"]);
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", "ERROR: " + JSON.stringify(error));
            }
        });
    }

    private publishGrid() {
        this.getGridImage()
        .then((image) => {
            if (image) {
                //publish the grid
                return this.publicationService.publishGrid(image, this.puzzle.info.title);
            } else {
                // no grid to publish, return a dummy response
                return Promise.resolve({
                    success: ApiResponseStatus.OK,
                    url: null,
                    message: null,
                })
            }
        })
        .then((result) => {
            if (result.success === ApiResponseStatus.OK) {
                this.appService.clearBusy();
                this.router.navigate(["/publish-complete"]);
            } else if (result.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.appService.setAlert("danger", "Username or password incorrect");
                this.authService.clearCredentials();
                this.router.navigate(["/publish-login"]);
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", "ERROR: " + JSON.stringify(error));
            }
        });
    }

}
