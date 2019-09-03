import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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
        private localStorage: LocalStorageService,
        private remoteStorage: RemoteStorageService ) {
    }

    ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        // this.remoteStorage.listPuzzles()
        // .then((list) => this.puzzleList = list );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onOpenCurrent(editor: EditorType) {
        this.localStorage.getPuzzle()
        .then(puzzle => {
            if (puzzle) {
                this.puzzleService.usePuzzle(puzzle);
                this.appService.setEditor(editor);
                this.router.navigate(["/" + editor]);
            }
        });
    }
}
