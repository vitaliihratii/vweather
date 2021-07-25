import { Component, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { first, switchMap, map, tap, filter, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { DATE_RANGES } from 'src/app/models/date-ranges';
import { EventEmitter } from 'events';
import { Subscription, Observable, of, Subject } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';
import { Router } from '@angular/router';
import { UiService } from 'src/app/core/services/ui.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { globalRangeSelector } from 'src/app/core/store/selectors/home.selectors';
import { GeneralWeatherData } from 'src/app/models/weather';
import { ForecastEntityService } from '../services/forecast-entity.service';
import { WeatherEntityService } from '../services/weather-entity.service';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { AutoUnsubscribeComponent } from 'src/app/shared/components/auto-unsubscribe/auto-unsubscribe.component';

@Component({
  selector: 'vwe-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherCardComponent extends AutoUnsubscribeComponent implements OnInit {


  @Input('city') cityName: string;

  generalWeather$: Observable<GeneralWeatherData>;
  deleteCitySubj: Subject<any> = new Subject();
  deleteCity$: Observable<any> = this.deleteCitySubj.asObservable();

  constructor(
    private weather: WeatherService,
    private store: Store<AppState>,
    private fes: ForecastEntityService,
    private wes: WeatherEntityService
    ) {
    super();
  }

  ngOnInit() {
    this.generalWeather$ = this.store.pipe(
      select(globalRangeSelector),
      switchMap(state => {
        if (state.globalRange === DATE_RANGES.CURRENT) {
          return this.weather.getWeather(this.cityName).pipe(
            map(weather => {
              return { main: weather.main, weather: weather.weather[0] };
            })
          );
        } else {
          return this.fes.entities$.pipe(
            exhaustMap(entts => {
              const queryEntt = entts.find(entt => entt.city === this.cityName);

              if (!queryEntt) {
                return this.fes.getByKey(this.cityName);
              } else {
                return of(queryEntt);
              }
            }),
            map(fEnt => of([...fEnt.weather])),
            switchMap(weather$ => this.weather.getAvarageData(weather$, state.globalRange))
          );
        }
      }
      )
    );

    this.deleteCity$.pipe(
      this.isAlive(),
      withLatestFrom(this.wes.entities$),
      map(([empty, entts]) => {
        const cityEntt = entts.find(entt => entt.name === this.cityName);

        if (!cityEntt) throw new Error(ERROR_CODES.CITY_NOTFOUND);
        
        return cityEntt.id;
      }),
      exhaustMap(cityId => this.wes.delete(cityId))
    ).subscribe();
  }

  deleteCity(ev: Event) {
    this.deleteCitySubj.next();
    ev.stopImmediatePropagation();
  }

}
