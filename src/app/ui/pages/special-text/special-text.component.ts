import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css']
})
export class SpecialTextComponent implements OnInit {

    constructor(private router: Router) { }

    public ngOnInit() {
    }

    public onContinue() {
        // this.router.navigate(["/blogger"]);
    }

    public onCancel() {
        this.router.navigate(["/home"]);
    }

}
