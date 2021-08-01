import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { Theme } from './enums/theme.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @HostBinding('class.light-theme') 
  get theme() {return this.currentTheme === 'light'};

  @HostBinding('class.dark-theme') 
  get theme_dark() {return this.currentTheme === 'dark'};

  loading = false;
  private currentTheme = 'light';

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit () {
    this.themeService.setDefaultTheme(Theme.LIGHT);
    this.themeService.currentTheme$.subscribe(
      (theme) => this.currentTheme = theme
    );

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
