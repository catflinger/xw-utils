import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-readme',
  templateUrl: './readme.component.html',
  styleUrls: ['./readme.component.css']
})
export class ReadmeComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
      //console.log(this.route.snapshot);
  }

}
