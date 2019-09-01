import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription } from 'rxjs';
import { PublicationService } from 'src/app/services/publication.service';

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
        private puzzleService: PuzzleService,
        private publiationService: PublicationService) { }

    ngOnInit() {
        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {

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
        this.publiationService.publish(this.puzzle, this.username, this.password)
            .then(() => {
                this.router.navigate(["/home"]);
            });
    }

}
