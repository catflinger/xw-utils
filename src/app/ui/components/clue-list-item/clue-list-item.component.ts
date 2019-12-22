import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Clue } from 'src/app/model/clue';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/common';

@Component({
    selector: 'app-clue-list-item',
    templateUrl: './clue-list-item.component.html',
    styleUrls: ['./clue-list-item.component.css']
})
export class ClueListItemComponent implements OnInit, OnDestroy {

    @Input() public clue: Clue;
    public klasses: string[];
    private subs: Subscription[] = [];

    constructor(private appSettings: AppSettingsService) { }

    public ngOnInit() {
        this.subs.push(this.appSettings.observe().subscribe(settings => {
            const validationRequired: boolean = this.appSettings.settings.general.showCommentValidation.enabled;
            const detailsRequired: boolean = this.appSettings.settings.general.showCommentEditor.enabled;
            this.klasses = [];


            if (this.clue.highlight) {
                this.klasses.push("highlight");
            }
    
            if (validationRequired) {
                let isSolved = detailsRequired ? 
                    this.clue.warnings.length === 0 :
                    this.clue.answer.length > 0;
    
                if (isSolved) {
                    this.klasses.push("solved");
                }
            }
        }));
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
