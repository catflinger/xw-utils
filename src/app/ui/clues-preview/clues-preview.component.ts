import { Component, OnInit, Input } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { Clue } from 'src/app/model/clue';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IActivePuzzle } from 'src/app/services/puzzle-management/puzzle-management.service';
import { TextStyle } from 'src/app/model/text-style';

@Component({
  selector: 'app-clues-preview',
  templateUrl: './clues-preview.component.html',
  styleUrls: ['./clues-preview.component.css']
})
export class CluesPreviewComponent implements OnInit {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public sample: Clue[] = [];

    public answerStyle: any = {};
    public clueStyle: any = {};
    public definitionStyle: any = {};
    private subs: Subscription[] = [];

    @Input() public includeGrid: boolean;

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


    private makeNgStyle(textStyle: TextStyle): any {
        return {
            "color": textStyle.color,
            "font-weight": textStyle.bold ? "bold" : "normal",
            "font-style": textStyle.italic ? "italic" : "normal",
            "text-decoration": textStyle.underline ? "underline" : "unset",
        }
    }
}
