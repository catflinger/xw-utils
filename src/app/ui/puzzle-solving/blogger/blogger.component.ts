import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { SelectClue } from 'src/app//modifiers/clue-modifiers/select-clue';
import { SelectNextClue } from 'src/app//modifiers/clue-modifiers/select-next-clue';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppService } from '../../services/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { ClueEditorService } from '../../components/editor/clue-editor.service';
import { ClueEditorComponent } from '../../components/editor/clue-editor/clue-editor.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appSettings;

    private subs: Subscription[] = [];
    private _showEditor = false;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private appSettinsgService: AppSettingsService, 
        private editorService: ClueEditorService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
                if (puzzle) {
                    if (!puzzle.capability.blogable) {
                        this.navService.goHome();
                    }
                    this.puzzle = puzzle;
                }
            }));

            this.subs.push(this.appSettinsgService.observe().subscribe(settings => this.appSettings = settings));
        }
    }

    ngOnDestroy(){
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
        this.activePuzzle.updateAndCommit(new SelectClue(clue.id));

        //Promise.resolve().then(() => this.openEditor());
        this.openEditor();
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
