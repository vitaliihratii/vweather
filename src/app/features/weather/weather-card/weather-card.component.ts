import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { first, switchMap, map, tap, filter, exhaustMap } from 'rxjs/operators';
import { DATE_RANGES } from 'src/app/models/date-ranges';
import { EventEmitter } from 'events';
import { Subscription, Observable, of } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';
import { Router } from '@angular/router';
import { UiService } from 'src/app/core/services/ui.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { globalRangeSelector } from 'src/app/core/store/selectors/home.selectors';
import { GeneralWeatherData } from 'src/app/models/weather';
import { ForecastEntityService } from '../services/forecast-entity.service';

@Component({
  selector: 'vwe-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent implements OnInit, OnDestroy {


  @Input('city') cityName: string;

  @Input() addMode;
  @Output() cityStored = new EventEmitter();
  darkMode: boolean;
  generalWeather$: Observable<GeneralWeatherData>;

  constructor(
    private weather: WeatherService,
    private store: Store<AppState>,
    private router: Router,
    private fes: ForecastEntityService) {
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
  }

  ngOnDestroy() {
  }

}
