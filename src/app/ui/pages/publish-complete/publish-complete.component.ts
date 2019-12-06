import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PublicationService } from 'src/app/services/publication.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppService } from '../../services/app.service';

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
        private appService: AppService,
        private activePuzzle: IActivePuzzle
    ) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.appService.goHome();
        }
    }
    
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.appService.goHome();
    }

}
