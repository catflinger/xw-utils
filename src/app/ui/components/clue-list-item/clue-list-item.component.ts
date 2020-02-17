import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Clue } from 'src/app/model/clue';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { Subscription } from 'rxjs';

export interface ClueListItemOptions {
    showSolved?: boolean;
    showEditButtons?: boolean;
}

export type ClueListAction = "edit" | "link" | "delete";

@Component({
    selector: 'app-clue-list-item',
    templateUrl: './clue-list-item.component.html',
    styleUrls: ['./clue-list-item.component.css']
})
export class ClueListItemComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    @Input() public clue: Clue;
    @Input() public options: ClueListItemOptions;
    @Output() public action = new EventEmitter<ClueListAction>();

    public klasses: string[];

    constructor(private appSettings: AppSettingsService) { }

    public ngOnInit() {

        if (!this.options) {
            this.options = {};
        }

        this.subs.push(this.appSettings.observe().subscribe(settings => {
            const validationRequired: boolean = settings.general.showCommentValidation.enabled;
            const detailsRequired: boolean = settings.general.showCommentEditor.enabled;
            this.klasses = [];

            if (this.clue.highlight) {
                this.klasses.push("highlight");
            }

            if (validationRequired) {
                let isSolved = detailsRequired ? 
                    this.clue.warnings.length === 0 :
                    this.clue.answer.length > 0;
    
                if (isSolved && this.options.showSolved) {
                    this.klasses.push("solved");
                }
            }
        }));
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onAction(action: ClueListAction) {
        this.action.emit(action);
    } 
}
