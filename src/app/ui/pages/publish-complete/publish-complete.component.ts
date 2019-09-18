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
        private activePuzzle: IActivePuzzle,
        private publiationService: PublicationService) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        }
    }
    
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.router.navigate(["/home"]);
    }

}
