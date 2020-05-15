import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, map, catchError, filter, tap } from 'rxjs/operators';
import { CurrentWeather, GeneralWeatherData, MainWeatherParams, WeatherType } from 'src/app/models/weather';
import { WeatherRangeItem } from 'src/app/models/weather-list-item';
import { WeatherList } from 'src/app/models/weather-list';
import { DATE_RANGES } from 'src/app/models/date-ranges';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(public http: HttpClient) {
  }

  getWeather(city: string): Observable<CurrentWeather> {
    const url = `${environment.openWeatherAPIUrl}weather?q=${city}&units=metric&APPID=${environment.appID}`;

    return this.http.get<CurrentWeather>(url).pipe(
      catchError((err: HttpErrorResponse) => throwError(err.error))
    );
  }

  getForecast(city: string, toDate = DATE_RANGES.FIVE_DAYS): Observable<WeatherRangeItem[]> {
    const url = `${environment.openWeatherAPIUrl}forecast?q=${city}&units=metric&APPID=${environment.appID}`;

    return this.http.get<WeatherList>(url).pipe(
      map(weather => weather.list),
      map(weatherList => weatherList.filter(weatherItem => this.filterWeatherForecast(weatherItem, toDate))),
    );
  }

  getAvarageData(weather$: Observable<WeatherRangeItem[]>, toDate: string): Observable<GeneralWeatherData> {
    return weather$.pipe(
      map(forecastArr => forecastArr.filter(item => this.filterWeatherForecast(item, toDate))),
      map(forecast => {
        return { main: forecast.map(item => item.main), weather: forecast.map(item => item.weather[0]) }
      }),
      map(weather => this.weatherMainParamsReducer(weather)),
      map(weather => this.weatherTypesReducer(weather))
    );
  }

  /**
   *
   * @param item actual weather item which evalutes against date derrived from range
   * @param range of Daterange type, from which date is derrived  
   * apiBalancedDate inner const was made in purpose to get date consumable by method depending on actual local user time  
   * LEAVE here for future purposes
   */
  filterWeatherForecast(item: WeatherRangeItem, range: string): boolean {
    const apiBalancedDate = new Date();

    switch (range) {
      case DATE_RANGES.TODAY:
      case DATE_RANGES.FIVE_DAYS:
        return new Date(item.dt * 1000) < this.getToDate(range) && new Date(item.dt * 1000) >= apiBalancedDate;
      case DATE_RANGES.TOMORROW:
      case DATE_RANGES.THIRD_DAY:
      case DATE_RANGES.FOURTH_DAY:
      case DATE_RANGES.FIFTH_DAY:
        const extraDays = range === DATE_RANGES.TOMORROW ? 1 :
                          range === DATE_RANGES.THIRD_DAY ? 2 :
                          range === DATE_RANGES.FOURTH_DAY ? 3 : 4;
        const fromDate = apiBalancedDate.setDate(apiBalancedDate.getDate() + extraDays);
        const exactFromDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));

        return new Date(item.dt * 1000) > exactFromDate && new Date(item.dt * 1000) <= this.getToDate(range);
    }
  }

  /**
   * @param to of Daterange type, from which date is derrived
   * apiBalancedDate const was made in purpose to get date consumable by method depending on actual local user time
   * LEAVE here for future purposes
   * setHours(24,0,0,0) sets date nest day 00:00:00, bcz API response .dt field for 21:00 evaluates to next day 00:00
   */
  private getToDate(to: string): Date {
    const apiBalancedDate = new Date();

    switch (to) {
      case DATE_RANGES.TODAY:
        return new Date(apiBalancedDate.setHours(24, 0, 0));
      case DATE_RANGES.TOMORROW:
      case DATE_RANGES.THIRD_DAY:
      case DATE_RANGES.FOURTH_DAY:
      case DATE_RANGES.FIFTH_DAY:
        const extraDays = to === DATE_RANGES.TOMORROW ? 1 :
                          to === DATE_RANGES.THIRD_DAY ? 2 :
                          to === DATE_RANGES.FOURTH_DAY ? 3 : 4;
        const nextDay = new Date().setDate(apiBalancedDate.getDate() + extraDays);
        return new Date(new Date(nextDay).setHours(24, 0, 0, 0));
      case DATE_RANGES.FIVE_DAYS:
        const fiveDays = new Date().setDate(apiBalancedDate.getDate() + 5);
        return new Date(new Date(fiveDays).setHours(24, 0, 0, 0));
    }
  }

  /**
   * Reduces weather params to avarage
   * Used to map @ngrx/entity read only collection, therefore reducing to new array
   * @param data necessary weather data
   */
  private weatherMainParamsReducer(data: { main: MainWeatherParams[], weather: WeatherType[] }) {
    const main = <MainWeatherParams>data.main.reduce((acc, item, index, arr) => {
      for (let key in item) {
        if (index === arr.length - 1) {
          acc[key] = acc[key] / index;
        } else {
          acc[key] = acc[key] ? acc[key] + item[key] : item[key];
        };
      }

      return acc;
    }, {});

    return { ...data, main };
  }

  /**
   * Reducer for weather type params, using OpenWeather codes to find the worst scenario
   * @param data necessary weather data (reduced main weather params)
   */
  private weatherTypesReducer(data: { main: MainWeatherParams, weather: WeatherType[] }) {
    const reducedWeather = data.weather
      .reduce((acc, item) => {
        // checking if there are any precipitations
        // lesser code --> worse weather conditions
        // https://openweathermap.org/weather-conditions
        if (item.id < 700 && item.id < acc.id || !acc) {
          acc = item;
        }

        return acc;
      });

    return { ...data, weather: reducedWeather };
  }
}
