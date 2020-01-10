import { Component, OnInit, OnDestroy } from '@angular/core';
import { concatMap, switchMap, share, map, filter, tap } from 'rxjs/operators';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { UiService } from 'src/app/core/services/ui.service';
import { ActivatedRoute, Params } from '@angular/router';
import { WeatherService } from 'src/app/core/services/weather.service';
import { DATE_RANGES } from 'src/app/models/date-ranges';
import { WeatherRangeItem } from 'src/app/models/weather-list-item';
import { DATE_RANGES_EXTRA_DAYS } from 'src/app/enums/date-ranges-extra-days';
import { DAYS } from 'src/app/enums/days';
import { ForecastEntityService } from '../services/forecast-entity.service';

@Component({
  selector: 'vwe-detailed-weather',
  templateUrl: './detailed-weather.component.html',
  styleUrls: ['./detailed-weather.component.css']
})
export class DetailedWeatherComponent implements OnInit, OnDestroy {

  private generalForecast$: Observable<WeatherRangeItem[]>;
  daysForecastArr = [];
  isFirstDayFull = false;

  darkMode: boolean;
  city: string;

  constructor(
    // public twitter: TwitterService, 
    public route: ActivatedRoute,
    public weatherS: WeatherService,
    public ui: UiService,
    private fes: ForecastEntityService) {

  }

  ngOnInit() {
    this.generalForecast$ = this.route.paramMap.pipe(
      tap((params: Params) => this.city = params.params['cityToken']),
      switchMap(() => this.fes.entityMap$.pipe(
        map(fDictionary => fDictionary[this.city].weather),
        share()
      )),
    );

    for (let i = 0; i < 5; i++) {
      this.daysForecastArr.push({
        name: this.getDate(i),
        forecast: this.generalForecast$.pipe(
          map(weather => weather.filter(weatherItem => this.weatherS.filterWeatherForecast(weatherItem, DATE_RANGES_EXTRA_DAYS[i]))),
          tap(weather => {
            if (weather.length === 8 && !i) {
              this.isFirstDayFull = true;
            }
          })
        )
      });
    }

  }

  ngOnDestroy() {
    // this.sub2.unsubscribe();
  }

  getDate(extraDays: number) {
    const currHours = new Date().getHours();
    const dayNum = new Date(new Date().setDate(new Date().getDate() + extraDays)).getDay() + (currHours >= 21 ? 1 : 0);

    return DAYS[dayNum];
  }

  getHours(time: string): string {
    return ('00' + new Date(time).getHours()).slice(-2);
  }
}
