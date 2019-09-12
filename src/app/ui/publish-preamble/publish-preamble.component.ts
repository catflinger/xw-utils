import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { UpdatePreamble } from 'src/app/services/puzzle/reducers/update-preamble';
import { IActivePuzzle } from 'src/app/services/puzzle/puzzle-management.service';

@Component({
    selector: 'app-publish-preamble',
    templateUrl: './publish-preamble.component.html',
    styleUrls: ['./publish-preamble.component.css']
})
export class PublishPreambleComponent implements OnInit {
    public puzzle = null;
    private subs: Subscription[] = [];
    public form: FormGroup;
    public appStatus: AppStatus;

    constructor(
        private appService: AppService,
        private router: Router,
        private puzzleService: IActivePuzzle,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {


            this.form = this.formBuilder.group({
                header: [""],
                body: [""]
            });

            this.subs.push(
                this.puzzleService.observe().subscribe(
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
        this.puzzleService.update(new UpdatePreamble(this.form.value.header, this.form.value.body));
        this.router.navigate(["/user-password"]);
    }

    onBack() {
        this.router.navigate(["/publish-options"]);
    }
}