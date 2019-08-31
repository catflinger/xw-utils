import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService } from 'src/app/services/publication.service';
import { Alert } from '../common';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-username-password',
    templateUrl: './username-password.component.html',
    styleUrls: ['./username-password.component.css']
})
export class UsernamePasswordComponent implements OnInit, OnDestroy {
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

    ngOnDestroy(){
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

    public clearAlerts() {
        while (this.alerts.length) {
            this.alerts.pop();
        }
    }

}
