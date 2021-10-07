import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { XAnswer } from '../jigsaw-model';

@Component({
    selector: 'app-jigsaw-clues-view',
    templateUrl: './jigsaw-clues-view.component.html',
    styleUrls: ['./jigsaw-clues-view.component.css']
})
export class JigsawCluesViewComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    @Input() public answers: readonly XAnswer[];

    constructor() { }

    public ngOnInit(): void {
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
}
