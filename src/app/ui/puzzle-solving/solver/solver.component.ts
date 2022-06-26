import { Component, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { SelectClueByCell } from 'src/app/modifiers/clue-modifiers/select-clue-by-cell';
import { ClueDialogService } from '../../puzzle-editing/tabbed-dialogs/clue-dialog.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { ClueDialogComponent } from '../../puzzle-editing/tabbed-dialogs/clue-dialog/clue-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PuzzleDialogComponent } from '../../puzzle-editing/tabbed-dialogs/puzzle-dialog/puzzle-dialog.component';
import { AppService } from '../../general/app.service';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolverComponent implements OnInit, OnDestroy {

    public puzzle: Puzzle = null;
    public appSettings: AppSettings = null;

    private subs: Subscription[] = [];
    private _showEditor = false;

    constructor(
        private appService: AppService,
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private editorService: ClueDialogService,
        private modalService: NgbModal,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            const observer: Observable<[Puzzle, AppSettings]> = combineLatest([
                this.activePuzzle.observe(),
                this.appSettingsService.observe()]);

            this.subs.push(
                observer.subscribe(
                    (result) => {
                        const puzzle = result[0];
                        const appSettings = result[1];

                        if (puzzle && appSettings) {
                            if (!puzzle.solveable) {
                                this.appService.setAlert("danger", "Cannot open this puzzle in solver: the puzzle is missing either clues or a grid");
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            this.appSettings = appSettings;
                        }

                        this.detRef.detectChanges();
                    }
            ));
        }
    }
    
    @HostListener('window:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        let key = event.key;
        let exp = new RegExp(String.raw`^[A-Z?]$`, "");

        if (key && typeof key === "string") {
            key = key.toUpperCase();

            if (this.puzzle && !this.editorService.isActive) {
                if (key === "ENTER") {
                    event.stopPropagation();
                    let clue = this.puzzle.getSelectedClue();
                    if (clue) { 
                        Promise.resolve(() => {
                            this.openEditor(null);
                            this.detRef.detectChanges();
                        });
                    }

                } else if (key === "ESCAPE") {
                    event.stopPropagation();
                    Promise.resolve(() => {
                        this.activePuzzle.updateAndCommit(new Clear());
                        this.detRef.detectChanges();
                    });

                } else if (exp.test(key)) {
                    event.stopPropagation();
                    let clue = this.puzzle.getSelectedClue();
                    if (clue) {
                        this.openEditor(key);
                    }
                }
            }
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

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
    
    public onContinue() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("continue");
    }

    public onBack() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }
    
    public onBlogger() {
        this.navService.navigate("blog");
    }

    public onJigsaw() {
        this.navService.navigate("jigsaw");
    }

    public onCellClick(cell: GridCell) {
        if (!cell.highlight) {
            this.activePuzzle.updateAndCommit(new SelectClueByCell(cell.id));
        } else {
            let clue = this.puzzle.getSelectedClue();

            if (clue) {
                this.openEditor(null);
            }
        }
    }

    public onFix() {
        let modalRef = this.modalService.open(PuzzleDialogComponent, { 
            backdrop: "static",
            size: "lg",
        });
        
        modalRef.componentInstance.close.subscribe(() => {
            modalRef.close();
        });
}

    public onClueClick(clue: Clue) {
        this.openEditor(null);
    }

    public onEditorClose() {
        this._showEditor = false;
    }

    private openEditor(key: string) {
        if (this._showEditor) {
            //???????

            //this.editorService.lastKeyPress.clear(key);
        } else {
            this._showEditor = true;

            this.editorService.lastKeyPress.put(key);

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
    }

}
