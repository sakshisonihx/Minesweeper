import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  show = true;
  constructor(private route: Router) { }
  ngOnInit() {
    this.route.navigate([''])
  }
  navigateTo() {
    this.route.navigate(['\home']);
    this.show = false;
  }
}