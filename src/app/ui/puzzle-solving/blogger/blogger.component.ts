import { Component, OnInit, OnDestroy, DoCheck, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { SelectClue } from 'src/app//modifiers/clue-modifiers/select-clue';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { ClueDialogComponent } from '../../puzzle-editing/tabbed-dialogs/clue-dialog/clue-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../general/app.service';

@Component({
    selector: 'app-blogger',
    templateUrl: './blogger.component.html',
    styleUrls: ['./blogger.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appSettings;

    private subs: Subscription[] = [];
    private _showEditor = false;

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private appSettinsgService: AppSettingsService,
        private modalService: NgbModal,
        private changeDetector: ChangeDetectorRef,
    ) {
        this.changeDetector.detach();
    }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            const puzzleObserver = this.activePuzzle.observe();
            const settingsObserver = this.appSettinsgService.observe();

            this.subs.push(combineLatest([puzzleObserver, settingsObserver]).subscribe(result => {
                const puzzle = result[0];
                const settings = result[1];

                this.appSettings = settings;

                if (puzzle) {
                    if (!puzzle.blogable) {
                        this.appService.setAlert("danger", "Cannot open this puzzle for blogging: the puzzle has no clues");
                        this.navService.goHome();
                    }
                    this.puzzle = puzzle;
                }
                this.changeDetector.detectChanges();
            }));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.navService.navigate("continue");
    }

    onBack() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    onSolver() {
        this.navService.navigate("solve");
    }

    onEditClues() {
        this.navService.navigate("edit");
    }

    onRowClick(clue: Clue) {
        if (clue.highlight) {
            this.openEditor();
        } else {
            this.activePuzzle.update(new SelectClue(clue.id));
        }

        //Promise.resolve().then(() => this.openEditor());
    }

    // vvvvvvvvvvv from here down shared with solver vvvvvvvvvvvvvvvvvvv
    //            TO DO: move this to a shared location

    public get showPuzzle(): boolean {
        let result = true;

        if (this.appSettings) {
            const mode = this.appSettings.editorMode;
            if (this._showEditor && mode === "fullscreen") {
                result = false;
            }
        }
        return result;
    }

    public get showEditor(): boolean {
        let result = false;

        if (this.appSettings) {
            const mode = this.appSettings.editorMode;

            if (this._showEditor && (mode === "fullscreen" || mode === "inline")) {
                result = true;
            }
        }
        return result;
    }

    public onEditorClose() {
        this._showEditor = false;
        this.changeDetector.detectChanges();
    }

    private openEditor() {
        if (this._showEditor) {
            //???????
        } else {
            this._showEditor = true;

            if (this.appSettings.editorMode === "modal") {
                let modalRef = this.modalService.open(ClueDialogComponent, {
                    backdrop: "static",
                    size: "lg",
                });

                modalRef.componentInstance.close.subscribe(() => {
                    modalRef.close();
                    this.onEditorClose();
                });
            }
        }
        this.changeDetector.detectChanges();
    }

}
