import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { City } from 'src/app/models/city';
import { HttpClient } from '@angular/common/http';
import { ForecastItem } from 'src/app/models/forecast';
import { WeatherService } from 'src/app/core/services/weather.service';
import { throwError } from 'rxjs';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { map } from 'rxjs/operators';

@Injectable()
export class ForecastDataService extends DefaultDataService<ForecastItem> {

  constructor(
    public http: HttpClient,
    private urlGen: HttpUrlGenerator,
    private weatherS: WeatherService
  ) {
    super('Forecast', http, urlGen);
  }

  getById(targetCity: string | number) {
    if (!targetCity) return throwError(ERROR_CODES.NO_CITY);

    // converting to string
    const city = '' + targetCity;

    return this.weatherS.getForecast(city).pipe(
      map(forecast => {
        return { city, weather: forecast };
      })
    );
  }
}
