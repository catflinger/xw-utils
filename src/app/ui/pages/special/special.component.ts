import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

    constructor(
        private appService: AppService,
        private router: Router,
    ) { }

    ngOnInit() {
    }

    public onPdf() {
        this.router.navigate(['/special-pdf']);
    }

    public onText() {
        this.appService.navContext.clear();
        this.appService.navContext.track = "create";
        this.appService.navContext.useGrid = false;

        this.router.navigate(['/special-text']);
    }

    public onGridText() {
        this.appService.navContext.clear();
        this.appService.navContext.track = "create";
        this.appService.navContext.useGrid = false;
        this.router.navigate(['/grid-start']);
    }

}
