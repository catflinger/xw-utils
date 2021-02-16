import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService, PublishGridResult } from 'src/app/services/puzzles/publication.service';
import { AppStatus, AppService } from 'src/app/ui/general/app.service';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { AppResultSymbols, PublishStatus, ContentGenerator } from 'src/app/services/common';
import { AuthService } from 'src/app/services/app/auth.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { GridComponent } from '../../grid/grid/grid.component';
import { fifteenSquaredGridBlack } from '../../common';
import { ListLayout } from 'src/app/services/content-generator/list-layout';
import { TableLayout } from 'src/app/services/content-generator/table-layout';

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
    public debugContent: string = "";
    public readonly gridColor = fifteenSquaredGridBlack;

    private subs: Subscription[] = [];

    private gridControl: GridComponent;

    @ViewChild(GridComponent, { static: true }) 
    set content(content: GridComponent) { this.gridControl = content };

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private authService: AuthService,
        private activePuzzle: IActivePuzzle,
        private publicationService: PublicationService
        ) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();

        } else if (!this.authService.getCredentials().authenticated) {
            this.navService.navigate("authenticate");

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

                            this.debugContent = this.getContentForDebug(puzzle, "http://aplace/aresource");
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
        this.navService.navigate("back");
    }

    private getGridImage(): string {
        let result: string = null;

        try {
            result = this.gridControl.getDataUrl("png").replace("data:image/png;base64,", "");
        } catch (error) {
            result = null;
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
            this.activePuzzle.updateAndCommit(new UpdateInfo({ wordPressId: result.wordpressId }));
            this.appService.clearBusy();
            this.navService.navigate("continue");
        })
        .catch(error => {
            if (error === AppResultSymbols.AuthorizationFailure) {
                this.appService.clear();
                this.appService.setAlert("danger", "Username or password incorrect");
                this.authService.clearCredentials();
                this.navService.navigate("authenticate");
            } else {
                this.appService.clear();
                this.appService.setAlert("danger", "ERROR Failed to publish:" + error);
            }
        });
    }

    private publishGrid() {
        let image = this.puzzle.grid ? this.getGridImage() : null;

        if (image) {
            this.publicationService.publishGrid(image, this.puzzle.info.title)
            .then(() => {
                this.appService.clearBusy();
                this.navService.navigate("continue");
            })
            .catch(error => {
                if (error === AppResultSymbols.AuthorizationFailure) {
                    this.appService.clear();
                    this.appService.setAlert("danger", "Username or password incorrect");
                    this.authService.clearCredentials();
                    this.navService.navigate("authenticate");
                } else {
                    this.appService.clear();
                    this.appService.setAlert("danger", "ERROR: " + error);
                }
            });
        }
    }

    private getContentForDebug(puzzle: Puzzle, gridUrl: string) {
        let generator: ContentGenerator= puzzle.publishOptions.layout === "list" ?
            new ListLayout():
            new TableLayout();

            return generator.getContent(puzzle, gridUrl);
    }

}
