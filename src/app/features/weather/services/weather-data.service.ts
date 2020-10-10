import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, DataServiceError } from '@ngrx/data';
import { City } from 'src/app/models/city';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { userSelector } from 'src/app/core/store/selectors/auth.selectors';
import { AppState } from 'src/app/core/store/state';
import { switchMap, filter, catchError } from 'rxjs/operators';
import { CityService } from 'src/app/core/services/city.service';
import { WeatherEntityService } from './weather-entity.service';

@Injectable()
export class WeatherDataService extends DefaultDataService<City> {

  constructor(
    public http: HttpClient,
    private urlGen: HttpUrlGenerator,
    private store: Store<AppState>,
    private cityS: CityService,
  ) {
    super('City', http, urlGen);
  }

  getAll() {
    return this.store.pipe(
      select(userSelector),
      filter(user => !!user),
      switchMap(user => this.cityS.getUserCities(user.id)),
    );
  }

  add(city: City) {
    return this.store.pipe(
      select(userSelector),
      switchMap(user => this.cityS.addCityUser(user.id, city)),
    );
  }

  delete(cityId: string) {
    return this.store.pipe(
      select(userSelector),
      switchMap(user => this.cityS.deleteCityUser(user.id, cityId))
    )
  }
}
