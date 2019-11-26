import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import moment from "moment";

import { ArchiveItem } from 'src/app/model/archive-item';
import { AppStatus, AppService, OpenPuzzleParamters } from 'src/app/ui/services/app.service';
import { PuzzleProvider } from 'src/app/model/interfaces';

const Sunday = 0;

@Component({
    selector: 'app-indy',
    templateUrl: './indy.component.html',
    styleUrls: ['./indy.component.css']
  })
  export class IndyComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public form: FormGroup;
    public provider: PuzzleProvider;
    public today: Date;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {
        this.provider = moment().day() === Sunday ? "ios" : "independent";
        this.today = new Date();
    }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            date: ["", Validators.required], 
        });

        this.appService.clearAlerts();
        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public openLatest() {
        this.openPuzzle(this.provider, this.today);
    }

    public openPuzzleByDate() {
        const date = moment(this.form.value.date).toDate();
        const provider = date.getDay() === Sunday ? "ios" : "independent";

        this.openPuzzle(provider, date);
    }

    private openPuzzle(provider: PuzzleProvider, date: Date) {
        this.appService.clear();
        this.appService.setOpenPuzzleParams({ provider, date});
        this.router.navigate(["open-puzzle"])
    }
}

