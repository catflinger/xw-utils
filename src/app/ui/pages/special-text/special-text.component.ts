import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, OpenPuzzleParamters } from '../../services/app.service';

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css']
})
export class SpecialTextComponent implements OnInit {
    public text: string = "ACROSS\n1 This is an across clue (5)\nDOWN\n2 This is a down clue (7)";
    public title: string = "un-named puzzle";

    constructor(
        private appService: AppService,
        private router: Router,
    ) { }

    public ngOnInit() {
    }

    public onContinue() {
        this.appService.clear();
        this.appService.setOpenPuzzleParams({ provider: "text", sourceText: this.text, title: this.title });
        this.router.navigate(["open-puzzle"]);
    }

    public onCancel() {
        this.router.navigate(["/home"]);
    }

}
