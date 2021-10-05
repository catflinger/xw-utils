import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/puzzle-model/clue';

/* 
    Note: CluesViewComponent vs CluesListComponent
    ==============================================
    
    CluesViewComponent is a passive observer that displays a list of clues
    CluesListComponent is an active view that implements editing of the clues
*/

@Component({
    selector: 'app-clues-view',
    templateUrl: './clues-view.component.html',
    styleUrls: ['./clues-view.component.css']
})
export class CluesViewComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    @Input() public clues: readonly Clue[];

    constructor() { }

    public ngOnInit(): void {
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }


}
