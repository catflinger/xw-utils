import { Component, OnInit } from '@angular/core';
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
        this.navService.beginTrack({track: "create-clues", data: {} });
    }

    public onGridText() {
        //this.appService.navContext.useGrid = true;
        this.navService.beginTrack({ track: "create-grid-clues", data: {} });
    }

}
