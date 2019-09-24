import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public preview: string = "";

    // private subs: Subscription[] = [];

    constructor(
        private router: Router,
        ) { }

    public ngOnInit() {
    }

    // public ngOnDestroy() {
    //     this.subs.forEach(sub => sub.unsubscribe());
    // }

    public onLoginClose() {
        this.router.navigate(["home"]);
    }

}
