import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiaryService } from 'src/app/services/diary.service';
import { Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { DiaryEntry } from 'src/app/model/diary-entry';

@Component({
    selector: 'app-diary',
    templateUrl: './diary.component.html',
    styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit, OnDestroy {
    public entries: DiaryEntry[];
    private subs: Subscription[] = [];

    constructor(
        private diaryService: DiaryService,
        private appService: AppService,
        private settingsService: AppSettingsService,
    ) { }

    public ngOnInit() {
        this.subs.push(this.diaryService.observe().subscribe(
            diary => {
                if (diary) {
                    this.appService.clear();
                    let aliases = this.settingsService.settings.diary.aliases;
                    
                    this.entries = [];
                    diary.entries.forEach(entry => {
                        if (this.settingsService.settings.diary.showEverybody || 
                            aliases.find(alias => alias.replace(/[^a-z]/gi, "") === entry.solver.replace(/[^a-z]/gi, ""))) {
                            
                                this.entries.push(entry);
                        }
                    });

                    this.entries.sort((a, b) => {
                        if (a.solveDate > b.solveDate) {
                            return 1;
                        } else if (a.solveDate < b.solveDate) {
                            return -1;
                        }
                        return 0;
                    });
                }
            },
            error => {
                this.appService.setAlert("danger", "Failed to get Google diary.");
                this.appService.clearBusy();
            }
        ));
        
        this.onRefresh();
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onRefresh() {
        this.appService.clear();
        this.appService.setBusy();
        this.diaryService.refresh();
    }

}
