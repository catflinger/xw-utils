import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
    selector: 'app-username-password',
    templateUrl: './username-password.component.html',
    styleUrls: ['./username-password.component.css']
})
export class UsernamePasswordComponent implements OnInit, OnDestroy {
    public puzzle = null;
    private subs: Subscription[] = [];

    constructor(private router: Router, private puzzleService: PuzzleService) { }

    ngOnInit() {
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
        this.router.navigate(["/publish-complete"]);
    }


}
