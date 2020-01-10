import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CityService } from 'src/app/core/services/city.service';
import { Observable, of, EMPTY, Subject, throwError, combineLatest } from 'rxjs';
import { Capital } from 'src/app/models/capital';
import { FormControl } from '@angular/forms';
import { switchMap, catchError, tap, retryWhen, exhaustMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { CurrentWeather } from 'src/app/models/weather';
import { WeatherDataService } from '../services/weather-data.service';
import { WeatherEntityService } from '../services/weather-entity.service';
import { ForecastEntityService } from '../services/forecast-entity.service';
import { DataServiceError } from '@ngrx/data';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { User } from 'src/app/models/user';
import { userSelector } from 'src/app/core/store/selectors/auth.selectors';
import { GuidService } from 'src/app/core/services/guid.service';

@Component({
  selector: 'vwe-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {

  capitals$: Observable<Capital[]>;
  errMsgSubj: Subject<string> = new Subject();
  addCitySubj: Subject<string> = new Subject();
  addCity$: Observable<any> = this.addCitySubj.asObservable();
  citySearchCtrl: FormControl;
  topCityWeather$: Observable<CurrentWeather>;
  topCityAdded$: Observable<boolean>;
  private user$: Observable<string>;
  readonly topCity = 'Kiev';


  constructor(
    private cityS: CityService,
    private guidS: GuidService,
    private weatherS: WeatherService,
    private wes: WeatherEntityService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit () {
    this.citySearchCtrl = new FormControl('');

    this.user$ = this.store.pipe(
      select(userSelector),
      map(user => user.id)
    );

    this.capitals$ = this.citySearchCtrl.valueChanges.pipe(
      tap(_ => this.errMsgSubj.next('')),
      switchMap(val => {
        return this.cityS.getCountriesCapitals(val).pipe(
          catchError((err, source) => {
            if (err === ERROR_CODES.CITY_NOTFOUND && val) {
              this.errMsgSubj.next(err);
            }
            return of([]);
          }),
        );
      })
    );

    this.topCityWeather$ = this.weatherS.getWeather(this.topCity);
    this.topCityAdded$ = this.wes.entities$.pipe(
      map(entts => entts.find(entt => entt.name === this.topCity) ? true : false)
    );

    const checkCity$ = this.addCitySubj.pipe(
      withLatestFrom(this.wes.entities$),
      map(([cityName, entts]) => entts.filter(entt => entt.name === cityName)),
      map(entts => !!entts.length)
    );

    this.addCity$ = checkCity$.pipe(
      withLatestFrom(this.addCitySubj),
      filter(([isAdded, cityName]) => {
        if (isAdded) this.errMsgSubj.next(ERROR_CODES.CITY_ALREADY_ADDED);

        return !isAdded;
      }),
      map(([isAdded, cityName]) => cityName),
      exhaustMap(cityName => this.wes.add({ id: this.guidS.newGuid(), name: cityName })),
      tap(_ => this.citySearchCtrl.setValue('')),
    );
  }
}
