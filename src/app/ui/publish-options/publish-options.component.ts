import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/services/app.service';
import { TextStyle } from 'src/app/model/text-style';
import { IActivePuzzle } from 'src/app/services/puzzle-management/puzzle-management.service';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css']
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public includeGrid: boolean;
    
    private subs: Subscription[] = [];


    constructor(
        private appService: AppService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
    ) { }

    ngOnInit() {

        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.router.navigate(["/publish-preamble"]);
    }

    onBack() {
        this.router.navigate(["/", this.appStatus.editor]);
    }
}
