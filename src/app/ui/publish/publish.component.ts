import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { PublicationService } from 'src/app/services/publication.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppStatus, AppService } from 'src/app/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management/puzzle-management.service';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
    public puzzle = null;
    public form: FormGroup;
    public appStatus: AppStatus;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private publicationService: PublicationService,
        private builder: FormBuilder) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));

            this.form = this.builder.group({
                'username': [""],
                'password': [""],
            });

            this.subs.push(
                this.activePuzzle.observe().subscribe(
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
        this.appService.setBusy();
        this.appService.clearAlerts();

        this.publicationService.publish(this.puzzle, "public", "public")
            .then(() => {
                this.appService.clearBusy();
                this.router.navigate(["/publish-complete"]);
            })
            .catch(error => {
                this.appService.clearBusy();
                this.appService.setAlert("danger", "ERROR: " + error);
            });
    }

    onBack() {
        this.router.navigate(["/publish-preamble"]);
    }
}
