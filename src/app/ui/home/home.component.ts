import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { PuzzleInfo } from 'src/app/model/puzzle-info';
import { RemoteStorageService } from 'src/app/services/remote-storage.service';
import { AppService, AppStatus, EditorType } from 'src/app/services/app.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    public puzzleList: PuzzleInfo[] = [];
    private subs: Subscription[] = [];
    public appStatus: AppStatus;

    constructor(
        private appService: AppService,
        private router: Router,
        private puzzleService: PuzzleService,
    ) { }

    ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        this.subs.push(this.puzzleService.getListObservable().subscribe(
            (list) => this.puzzleList = list,
            (error) => this.appService.setAlert("danger", error.toString())
        ));
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onOpenSaved(id: string) {
        this.puzzleService.loadSavedPuzzle(id)
        .then((puzzle) => {
            console.log("GOT " + puzzle);
            if (puzzle) {
                let editor: EditorType = puzzle.solveable ? "solver" : "blogger";
                this.appService.setEditor(editor);
                this.router.navigate(["/" + editor]);
            }
        });
    }

    public onDelete(id: string) {
        this.puzzleService.deletePuzzle(id);
    }

}
