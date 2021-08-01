import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { FormControl } from '@angular/forms';
import { tap, map, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { globalRangeChanged } from 'src/app/core/store/actions/home.actions';
import { DATE_RANGES } from 'src/app/models/date-ranges';
import { Observable } from 'rxjs';
import { RouterStateSelector } from 'src/app/core/store/selectors';
import { APP_ROUTES_NAMES } from 'src/app/app.routes.names';
import { AuthService } from 'src/app/core/services/auth.service';
import { signout } from 'src/app/core/store/actions/auth.actions';
import { User } from 'src/app/models/user';
import { userSelector } from 'src/app/core/store/selectors/auth.selectors';
import { SelectItem } from 'src/app/models/select-item';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'vwe-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  showMenu = false;
  sub1;
  darkModeActive: boolean;
  weatherRangeCtrl: FormControl;
  ranges = DATE_RANGES;
  // for switching 'Today' global option --> no forecast items after 21:00, therefore current = today
  currHours = new Date().getHours();
  showGlobalRangSelect$: Observable<boolean>;
  user$: Observable<User>;
  logout$: Observable<any>;
  toggleTheme: () => void;

  readonly dateRangeOptions: SelectItem[] = this.currHours < 21 ? [
    { value: DATE_RANGES.CURRENT, label: 'Current' },
    { value: DATE_RANGES.TODAY, label: 'Today' },
    { value: DATE_RANGES.TOMORROW, label: 'Tomorrow' },
  ] : [
      { value: DATE_RANGES.CURRENT, label: 'Current' },
      { value: DATE_RANGES.TOMORROW, label: 'Tomorrow' },
    ];

  constructor(
    private store: Store<AppState>,
    private authS: AuthService,
    private themeS: ThemeService
  ) {
    this.toggleTheme = themeS.toggleTheme.bind(themeS);
   }

  ngOnInit () {
    this.weatherRangeCtrl = new FormControl(this.dateRangeOptions[0]);

    this.weatherRangeCtrl.valueChanges.pipe(
      tap((range: SelectItem) => this.store.dispatch(globalRangeChanged({ range: range.value })))
    ).subscribe();

    this.showGlobalRangSelect$ = this.store.pipe(
      select(RouterStateSelector),
      filter(state => !!state),
      map(state => state.state.url === '/' + APP_ROUTES_NAMES.HOME)
    );

    this.user$ = this.store.pipe(
      select(userSelector)
    );
  }

  ngOnDestroy () {
  }

  toggleMenu () {
    this.showMenu = !this.showMenu;
  }

  logout () {
    this.logout$ = this.authS.logout().pipe(
      tap(_ => this.store.dispatch(signout()))
    );
  }
}
