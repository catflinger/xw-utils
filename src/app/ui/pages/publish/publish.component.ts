import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService, PublishGridResult } from 'src/app/services/publication.service';
import { AppStatus, AppService } from 'src/app/ui/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { PatchPuzzleInfo } from 'src/app/services/modifiers/patch-puzzle-info';
import { Puzzle } from 'src/app/model/puzzle';
import { ApiSymbols, PublishStatus } from 'src/app/services/common';
import { AuthService } from 'src/app/services/auth.service';
import { GridComponent } from '../../components/grid/grid.component';

export type PublishActions = "nothing" | "upload" | "publish" | "copy-post" | "copy-grid" | "replace-post" | "replace-grid";

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public alreadyPublished = false;
    public gridOnly = false;
    public action: PublishActions = "nothing";

    private subs: Subscription[] = [];

    private gridControl: GridComponent;

    @ViewChild(GridComponent, { static: true }) 
    set content(content: GridComponent) { this.gridControl = content };

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private publicationService: PublicationService
        ) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.appService.goHome();

        } else if (!this.authService.getCredentials().authenticated) {
            this.router.navigate(["/publish-login"]);

        } else {
            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                            this.alreadyPublished = !!puzzle.info.wordpressId;
                            
                            if (!this.alreadyPublished) {
                                this.action = "upload";
                            }
    
                            this.gridOnly = puzzle.grid && puzzle.clues === null;
                            if (this.gridOnly) {
                                this.action = "copy-grid";
                            }
                        }
                    }
                )
            );
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.appService.clear();

        // TO DO: link the media on WP to the post id
        // 1. first create a post with placeholder content, get back the post id
        // 2. upload media with post id, get back url of image
        // 3. update post with actual content incluidng the image url

        switch (this.action) {
            case "upload":
                this.appService.setBusy();
                this.publishPost("draft");
                break;
            case "publish":
                this.appService.setBusy();
                this.publishPost("publish");
                break;
            case "copy-grid":
                this.appService.setBusy();
                this.publishGrid();
                break;
            case "copy-post":
                this.appService.setBusy();
                this.publishPost("draft");
                break;
            case "replace-grid":
                this.appService.setAlert("info", "Sorry, this feature is still work in progress, we hope to have it finished soon.")
                break;
            case "replace-post":
                this.appService.setAlert("info", "Sorry, this feature is still work in progress, we hope to have it finished soon.")
                break;
            default:
                // do nothing
                break;
        }
    }

    public get hasCredentials(): boolean {
        return this.authService.getCredentials() !== null;
    }

    public onBack() {
        let route: string;

        if (this.gridOnly) {
            route = "/grid-editor"
        } else {
            route = "/publish-preamble";
        }
        this.router.navigate([route]);
    }

    private getGridImage(): string {
        let result: string = null;

        try {
            result = this.gridControl.getDataUrl().replace("data:image/png;base64,", "");
        } catch (error) {
            console.log(error);
        }

        return result;
    }

    private publishPost(status: PublishStatus) {
        let image = this.puzzle.publishOptions.includeGrid && this.puzzle.grid ?
            this.getGridImage() :
            null;

        let promise: Promise<PublishGridResult> = image ?
            this.publicationService.publishGrid(image, this.puzzle.info.title) :
            Promise.resolve({ wordpressId: null, url: null }); 
        
        promise.then((result) => {
            return this.publicationService.publishPost(this.puzzle, result.url, status);
        })
        .then((result) => {
            this.activePuzzle.update(new PatchPuzzleInfo(result.wordpressId));
            this.appService.clearBusy();
            this.router.navigate(["/publish-complete"]);
        })
        .catch(error => {
            if (error === ApiSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.appService.setAlert("danger", "Username or password incorrect");
                this.authService.clearCredentials();
                this.router.navigate(["/publish-login"]);
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", "ERROR: " + error);
            }
        });
    }

    private publishGrid() {
        let image = this.puzzle.grid ? this.getGridImage() : null;

        if (image) {
            this.publicationService.publishGrid(image, this.puzzle.info.title)
            .then(() => {
                this.appService.clearBusy();
                this.router.navigate(["/publish-complete"]);
            })
            .catch(error => {
                if (error === ApiSymbols.AuthorizationFailure) {
                    this.appService.clear();
                    this.appService.setAlert("danger", "Username or password incorrect");
                    this.authService.clearCredentials();
                    this.router.navigate(["/publish-login"]);
                } else {
                    this.appService.clear();
                    this.appService.setAlert("danger", "ERROR: " + error);
                }
            });
        }
    }
}
