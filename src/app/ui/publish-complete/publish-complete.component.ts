import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PublicationService } from 'src/app/services/publication.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';

@Component({
    selector: 'app-publish-complete',
    templateUrl: './publish-complete.component.html',
    styleUrls: ['./publish-complete.component.css']
})
export class PublishCompleteComponent implements OnInit, OnDestroy {
    public puzzle = null;
    public username: string;
    public password: string;

    private subs: Subscription[] = [];

    constructor(
        private router: Router,
        private puzzleService: IActivePuzzle,
        private publiationService: PublicationService) { }

    ngOnInit() {
        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

            this.subs.push(
                this.puzzleService.observe().subscribe(
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
        this.publiationService.publish(this.puzzle, this.username, this.password)
            .then(() => {
                this.router.navigate(["/home"]);
            });
    }

}
