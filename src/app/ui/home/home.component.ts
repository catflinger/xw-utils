import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Router } from '@angular/router';
import { PuzzleInfo } from 'src/app/model/puzzle-info';
import { RemoteStorageService } from 'src/app/services/remote-storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public puzzleList: PuzzleInfo[] = [];

    constructor(
        private router: Router,
        private puzzleService: PuzzleService,
        private localStorage: LocalStorageService,
        private remoteStorage: RemoteStorageService ) {
    }

    ngOnInit() {
        // this.remoteStorage.listPuzzles()
        // .then((list) => this.puzzleList = list );
    }

    public onOpenCurrent() {
        this.localStorage.getPuzzle()
        .then(puzzle => {
            if (puzzle) {
                this.puzzleService.usePuzzle(puzzle);
                this.router.navigate(["/solver"]);
            }
        });
    }
}
