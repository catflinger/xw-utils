import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { UpdatePreamble } from 'src/app/services/modifiers/update-preamble';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clue } from 'src/app/model/clue';

@Component({
    selector: 'app-publish-preamble',
    templateUrl: './publish-preamble.component.html',
    styleUrls: ['./publish-preamble.component.css']
})
export class PublishPreambleComponent implements OnInit {
    public puzzle = null;
    public form: FormGroup;
    public appStatus: AppStatus;
    public sample: Clue[];
    public today = new Date();

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {


            this.form = this.formBuilder.group({
                title: [""],
                header: { ops: [] },
                body: { ops: [] }
            });

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        if (puzzle) {
                            // this.header = puzzle.notes.header;
                            this.sample = this.puzzle.clues.filter((c, i) => i < 3);
                            this.form.patchValue(puzzle.notes);
                            this.form.patchValue({ title: puzzle.info.title});
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.activePuzzle.update(new UpdatePreamble(
            this.form.value.title,
            this.form.value.header,
            this.form.value.body));
        this.router.navigate(["/user-password"]);
    }

    onBack() {
        this.activePuzzle.update(new UpdatePreamble(
            this.form.value.title,
            this.form.value.header,
            this.form.value.body));
        this.router.navigate(["/publish-options"]);
    }

}