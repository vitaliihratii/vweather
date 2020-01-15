import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CityService } from 'src/app/core/services/city.service';
import { Observable, of, Subject, merge } from 'rxjs';
import { Capital } from 'src/app/models/capital';
import { FormControl } from '@angular/forms';
import { switchMap, catchError, tap, exhaustMap, filter, map, withLatestFrom, delay } from 'rxjs/operators';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { CurrentWeather } from 'src/app/models/weather';
import { WeatherEntityService } from '../services/weather-entity.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
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
  cityAddedSuccess$: Observable<any>;
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

    const cityAddSuccessSubj = new Subject();
    const cityAddSuccess$ = cityAddSuccessSubj.pipe(
      delay(1500),
      tap(_ => cityAddSuccessSubj.next(''))
    );
    this.cityAddedSuccess$ = merge(
      cityAddSuccessSubj,
      cityAddSuccess$
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
      tap(_ => cityAddSuccessSubj.next('City was added to your list'))
    );

  }

}
