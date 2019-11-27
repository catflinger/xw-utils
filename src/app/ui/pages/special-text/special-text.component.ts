import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, OpenPuzzleParamters } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const defaultText: string = "ACROSS\n1 This is an across clue (5)\nDOWN\n2 This is a down clue (7)";

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css']
})
export class SpecialTextComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private appService: AppService,
        private router: Router,
        private fb: FormBuilder,
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            title: ["", Validators.required],
            text: [defaultText, Validators.required],
        });
    }

    public onContinue() {
        this.appService.clear();
        this.appService.setOpenPuzzleParams({ provider: "text", sourceText: this.form.value.text, title: this.form.value.title });
        this.router.navigate(["open-puzzle"]);
    }

    public onCancel() {
        this.router.navigate(["/home"]);
    }

}
