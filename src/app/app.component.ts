import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  show = true;
  constructor(private route: Router) { }
  ngOnInit() {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is exactly the root ('/')
        this.show = event.url === '/';
      }
    });
  }
  navigateTo() {
    this.route.navigate(['\home']);
    this.show = false;
  }
}