import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/services/app.service';
import { TextStyle } from 'src/app/model/text-style';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css']
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle = null;
    public appStatus: AppStatus;
    
    public answerStyle: any = {};
    public clueStyle: any = {};
    public definitionStyle: any = {};

    private subs: Subscription[] = [];


    constructor(
        private appService: AppService,
        private router: Router, 
        private puzzleService: PuzzleService,
    ) { }

    ngOnInit() {

        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
        
        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.subs.push(
                this.puzzleService.getObservable().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;

                        this.answerStyle = this.makeNgStyle(puzzle.publishOptions.answerStyle); 
                        this.clueStyle = this.makeNgStyle(puzzle.publishOptions.clueStyle); 
                        this.definitionStyle = this.makeNgStyle(puzzle.publishOptions.definitionStyle); 
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
