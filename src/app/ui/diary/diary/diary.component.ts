import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DiaryService } from 'src/app/services/app/diary.service';
import { Subscription, combineLatest } from 'rxjs';
import { AppService } from '../../general/app.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { DiaryEntry } from 'src/app/model/diary-model/diary-entry';
import { AppResultSymbols } from 'src/app/services/common';

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
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {
        let observable = combineLatest(this.diaryService.observe(), this.settingsService.observe());

        this.subs.push(observable.subscribe(
            result => {
                let diary = result[0];
                let settings = result[1];

                if (settings) {
                    if (diary) {
                        this.appService.clear();
                        let aliases = settings.diary.aliases;
                        
                        this.entries = [];
                        diary.entries.forEach(entry => {
                            if (settings.diary.showEverybody || 
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

                    } else {
                        this.onRefresh();
                    }
                }
                this.detRef.detectChanges();
            },
            error => {
                this.appService.clear();
                if (error === AppResultSymbols.AuthorizationFailure) {
                    this.appService.setAlert("danger", "User not logged in.  Please login and try again.");
                } else {
                    this.appService.setAlert("danger", "Failed to get Google diary.");
                }
                this.detRef.detectChanges();
            }
        ));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onRefresh() {
        this.appService.clear();
        this.appService.setBusy();
        this.diaryService.refresh()
        .then((result: Symbol) => {
            this.appService.clear();
            if (result === AppResultSymbols.AuthorizationFailure) {
                this.appService.setAlert("danger", "Not logged-in.  Please log in and try again.");
            } else if (result != AppResultSymbols.OK) {
                this.appService.setAlert("danger", "Failed to get Google diary.");
            }
            this.detRef.detectChanges();
        })
        .catch((error) => {
            this.appService.clear();
            if (error === AppResultSymbols.AuthorizationFailure) {
                this.appService.setAlert("danger", "Not logged-in.  Please log in and try again.");
            } else {
                this.appService.setAlert("danger", "Failed to get Google diary.");
            }
            this.detRef.detectChanges();
        });
    }

}
