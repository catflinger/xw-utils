import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/services/app.service';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Router } from '@angular/router';
import { UIResult } from '../../common';

@Component({
    selector: 'app-publish-login',
    templateUrl: './publish-login.component.html',
    styleUrls: ['./publish-login.component.css']
})
export class PublishLoginComponent implements OnInit {
    private subs: Subscription[] = [];
    public appStatus: AppStatus;

    constructor(
        private router: Router,
        private activePuzzle: IActivePuzzle,
        private appService: AppService,
    ) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        }
    }

    public onClose(result: UIResult) {
        this.appService.clear();
        if (result === "cancel" || result==="back") {
            this.router.navigate(["/publish-preamble"]);
        } else {
            this.router.navigate(["/publish"]);
        }
    }
}
