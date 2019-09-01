import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService } from 'src/app/services/publication.service';
import { Alert } from '../common';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
    public puzzle = null;
    private subs: Subscription[] = [];
    public alerts: Alert[] = [];
    public working: boolean = false;
    public form: FormGroup;

    constructor(
        private router: Router,
        private puzzleService: PuzzleService,
        private publicationService: PublicationService,
        private builder: FormBuilder) { }

    ngOnInit() {
        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.form = this.builder.group({
                'username': [""],
                'password': [""],
            });

            this.subs.push(
                this.puzzleService.getObservable().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.working = true;
        this.clearAlerts();

        this.publicationService.publish(this.puzzle, "public", "public")
            .then(() => {
                this.router.navigate(["/publish-complete"]);
            })
            .catch(error => {
                this.working = false;
                this.alerts.push(new Alert("danger", "ERROR: " + error))
            });
    }

    onBack() {
        this.router.navigate(["/publish-preamble"]);
    }
    public clearAlerts() {
        while (this.alerts.length) {
            this.alerts.pop();
        }
    }

}
