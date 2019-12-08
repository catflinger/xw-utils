import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { Router } from '@angular/router';
import { PuzzleInfo } from 'src/app/model/puzzle-info';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { Subscription } from 'rxjs';
import { AuthService, Credentials } from 'src/app/services/auth.service';
import { NavService, EditorType } from '../../navigation/nav.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    public puzzleList: PuzzleInfo[] = [];
    public gridList: PuzzleInfo[] = [];
    private subs: Subscription[] = [];
    public appStatus: AppStatus;
    public credentials: Credentials;

    constructor(
        private appService: AppService,
        private navService: NavService,
        private puzzleManagement: IPuzzleManager,
        private authService: AuthService,
    ) { }

    ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
        this.subs.push(this.authService.observe().subscribe(credentials => this.credentials = credentials));

        this.subs.push(this.puzzleManagement.getPuzzleList().subscribe(
            (list) => {
                this.puzzleList = list.filter(p => (p.solveable || p.blogable));
                this.gridList = list.filter(p => p.gridable && !(p.solveable || p.blogable));
            },
            (error) => this.appService.setAlert("danger", error.toString())
        ));
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onOpenSaved(id: string) {
        this.puzzleManagement.openPuzzle(id)
        .then((puzzle) => {
            if (puzzle) {
                if (puzzle.info.gridable && !(puzzle.info.solveable || puzzle.info.blogable)) {
                    //this.appService.navContext.editor = null;
                    this.navService.beginTrack("publish", {});
                } else {
                    let editor: EditorType = puzzle.info.solveable ? "solver" : "blogger";
                    this.navService.beginTrack("publish", { editor }, editor);
                }
            }
        });
    }

    public onDelete(id: string) {
        this.puzzleManagement.deletePuzzle(id);
    }
}
