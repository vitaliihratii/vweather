import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit () {
    this.router.events.subscribe(ev => {
      switch (true) {
        case ev instanceof NavigationStart:
          this.loading = true;
          break;
        case ev instanceof NavigationEnd:
        case ev instanceof NavigationCancel:
        case ev instanceof NavigationError:
          this.loading = false;
          break;
        default:
          break;
      }
    });
  }
}
