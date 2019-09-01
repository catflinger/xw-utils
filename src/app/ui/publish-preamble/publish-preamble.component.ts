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
    private subs: Subscription[] = [];
    public form: FormGroup;

    constructor(
        private router: Router,
        private puzzleService: PuzzleService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {


            this.form = this.formBuilder.group({
                header: [""],
                body: [""]
            });

            this.subs.push(
                this.puzzleService.getObservable().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        if (puzzle) {
                            this.form.patchValue(puzzle.notes);
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.puzzleService.updatePreamble(this.form.value.header, this.form.value.body);
        this.router.navigate(["/user-password"]);
    }

    onBack() {
        this.router.navigate(["/publish-options"]);
    }
}