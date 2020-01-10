import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, merge, combineLatest } from 'rxjs';
import { City } from 'src/app/models/city';
import { WeatherEntityService } from './weather-entity.service';
import { withLatestFrom, tap, filter, map, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CityResolver implements Resolve<boolean> {

  constructor(
    private wes: WeatherEntityService
  ) { }

  resolve (route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return combineLatest([
        this.wes.entities$,
        this.wes.loaded$
      ]).pipe(
        tap(([entts, loaded]) => !loaded ? this.wes.getAll().pipe(first()) : ''),
        filter(([entts, loaded]) => loaded),
        map(([entts, loaded]) => loaded),
        first()
      );
  }
}
