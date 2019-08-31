import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-publish-preamble',
    templateUrl: './publish-preamble.component.html',
    styleUrls: ['./publish-preamble.component.css']
})
export class PublishPreambleComponent implements OnInit {
    public puzzle = null;
    public form: FormGroup;
    private subs: Subscription[] = [];

    constructor(
        private router: Router,
        private puzzleService: PuzzleService,
        private builder: FormBuilder) { }

    ngOnInit() {

        this.form = this.builder.group({
            'header': [""],
            'body': [""],
        });

        this.subs.push(
            this.puzzleService.getObservable().subscribe(
                (puzzle) => {
                    this.puzzle = puzzle;
                    if (puzzle) {
                        this.form.controls.header.patchValue(puzzle.notes.header);
                        this.form.controls.body.patchValue(puzzle.notes.body);
                    } else {
                        this.form.controls.header.patchValue("");
                        this.form.controls.body.patchValue("");
                    }
                }
            ));
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        let updates = this.form.value;

        console.log("FORM: " + JSON.stringify(updates));

        this.puzzleService.updatePreamble(updates.header, updates.body);
        this.router.navigate(["/user-password"]);
    }

}