import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { Subscription, combineLatest } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';

export interface ClueListItemOptions {
    showSolved?: boolean;
}

@Component({
    selector: 'app-clue-list-item',
    templateUrl: './clue-list-item.component.html',
    styleUrls: ['./clue-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueListItemComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    @Input() public clueId: string;
    @Input() public options: ClueListItemOptions;
    
    public klasses: string[];
    public clue: Clue = null;

    constructor(
        private appSettings: AppSettingsService,
        private detRef: ChangeDetectorRef,
        private activePuzzle: IActivePuzzle,
    ) { }

    public ngOnInit() {

        if (!this.options) {
            this.options = {};
        }

        this.subs.push(
            combineLatest(
                this.appSettings.observe(), 
                this.activePuzzle.observe(),
            ).subscribe(result => {
                const settings = result[0];
                const puzzle = result[1];
                
                if(puzzle && settings) {
                    const validationRequired: boolean = settings.general.showCommentValidation.enabled;
                    const detailsRequired: boolean = true; //settings.general.showCommentEditor.enabled;
                    this.klasses = [];

                    this.clue = puzzle.clues.find(c =>c.id === this.clueId);

                    if (this.clue) {
                        if (this.clue.highlight) {
                            this.klasses.push("highlight");
                        }
    
                        if (validationRequired) {
                            let isSolved = detailsRequired ? 
                            this.clue.warnings.length === 0 :
                            this.clue.answers[0].length > 0;
                
                            if (isSolved && this.options.showSolved) {
                                this.klasses.push("solved");
                            }
                        }
    
                        this.detRef.detectChanges();
                        }
                } else {
                    this.clue = null;
                }
            })
        );
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
