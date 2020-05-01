import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle'; 
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Clear } from 'src/app/modifiers/puzzle-modifiers/clear';
import { SelectClueByCell } from 'src/app/modifiers/clue-modifiers/select-clue-by-cell';
import { ClueEditorService } from '../../components/editor/clue-editor.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';
import { ClueEditorComponent } from '../../components/editor/clue-editor/clue-editor.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolverComponent implements OnInit {

    public puzzle: Puzzle = null;
    public appSettings: AppSettings = null;

    private subs: Subscription[] = [];
    private _showEditor = false;

    constructor(
        private navService: NavService<AppTrackData>,
        private activePuzzle: IActivePuzzle,
        private appSettingsService: AppSettingsService,
        private editorService: ClueEditorService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            const observer: Observable<[Puzzle, AppSettings]> = combineLatest(
                this.activePuzzle.observe(),
                this.appSettingsService.observe());

            this.subs.push(
                observer.subscribe(
                    (result) => {
                        const puzzle = result[0];
                        const appSettings = result[1];

                        if (puzzle && appSettings) {
                            if (!puzzle.capability.solveable) {
                                this.navService.goHome();
                            }
                            this.puzzle = puzzle;
                            this.appSettings = appSettings;
                        }
                    }
            ));
        }
    }
    
    @HostListener('window:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (this.puzzle && !this.editorService.isActive) {
            if (event.key === "Enter") {
                event.stopPropagation();
                let clue = this.puzzle.getSelectedClue();
                if (clue) { 
                    this.openEditor();
                }
            } else if (event.key === "Escape") {
                event.stopPropagation();
                this.activePuzzle.updateAndCommit(new Clear());
            }
            // } else if (/^[a-zA-Z]$/.test(event.key)) {
            //     event.stopPropagation();
            //     let clue = this.puzzle.getSelectedClue();
            //     if (clue) {
            //         this.openEditor(event.key);
            //     }
            // }
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
    
    public onCellClick(cell: GridCell) {
        if (!cell.highlight) {
            this.activePuzzle.updateAndCommit(new SelectClueByCell(cell.id));
        } else {
            let clue = this.puzzle.getSelectedClue();

            if (clue) {
                this.openEditor();
            }
        }
    }

    public onClueClick(clue: Clue) {
        this.openEditor();
    }

    public onEditorClose() {
        this._showEditor = false;
    }

    private openEditor() {
        if (this._showEditor) {
            //???????
        } else {
            this._showEditor = true;

            if (this.appSettings.editorMode === "modal") {
                let modalRef = this.modalService.open(ClueEditorComponent, { 
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
