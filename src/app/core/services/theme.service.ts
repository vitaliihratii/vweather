import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Theme } from 'src/app/enums/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme: Theme;
  private themeSubject: BehaviorSubject<Theme>;

  currentTheme$: Observable<Theme>;

  constructor() { }

  setDefaultTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.themeSubject = new BehaviorSubject(theme);
    this.currentTheme$ = this.themeSubject.asObservable();
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    this.themeSubject.next(this.currentTheme);
  }
}
