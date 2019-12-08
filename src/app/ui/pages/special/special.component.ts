import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { NavService } from '../../navigation/nav.service';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private navService: NavService,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.navService.gotoRoute(['/special-pdf']);
    }

    public onText() {
        //this.appService.navContext.useGrid = false;
        this.navService.beginTrack("create", {});
    }

    public onGridText() {
        //this.appService.navContext.useGrid = true;
        this.navService.beginTrack("create", {});
    }

}
