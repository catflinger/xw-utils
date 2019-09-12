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
    public sample: Clue[] = [];

    public answerStyle: any = {};
    public clueStyle: any = {};
    public definitionStyle: any = {};

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

                            this.answerStyle = this.makeNgStyle(puzzle.publishOptions.answerStyle);
                            this.clueStyle = this.makeNgStyle(puzzle.publishOptions.clueStyle);
                            this.definitionStyle = this.makeNgStyle(puzzle.publishOptions.definitionStyle);

                            this.sample = this.puzzle.clues.filter((c, i) => i < 3);
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

    private makeNgStyle(textStyle: TextStyle): any {
        return {
            "color": textStyle.color,
            "font-weight": textStyle.bold ? "bold" : "normal",
            "font-style": textStyle.italic ? "italic" : "normal",
            "text-decoration": textStyle.underline ? "underline" : "unset",
        }
    }
}
