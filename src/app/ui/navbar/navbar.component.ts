import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isNavbarCollapsed = true;

    @Output() solve = new EventEmitter<string>();

    constructor() { }

    ngOnInit() {
    }

    public onSolveClick(provider: string) {
        this.solve.emit(provider);
    }
}

