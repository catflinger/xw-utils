import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiaryService } from 'src/app/services/diary.service';
import { Diary } from 'src/app/model/diary';
import { Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-diary',
    templateUrl: './diary.component.html',
    styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit, OnDestroy {
    public diary: Diary;
    private subs: Subscription[] = [];

    constructor(
        private diaryService: DiaryService,
        private appService: AppService,
    ) { }

    public ngOnInit() {
        this.subs.push(this.diaryService.observe().subscribe(
            diary => {
                this.diary = diary;
                this.appService.clear();
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
