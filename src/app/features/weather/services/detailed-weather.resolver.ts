import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, first, filter } from 'rxjs/operators';
import { ForecastEntityService } from './forecast-entity.service';


@Injectable()
export class DetailedWeatherResolver implements Resolve<boolean> {
  constructor(
    private fes: ForecastEntityService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const city = route.params['cityToken'];
    this.fes.setFilter({city});

    return this.fes.filteredEntities$.pipe(
      tap(entts => {
        if (!entts.length) {
          this.fes.getByKey(city);
        }
      }),
      filter(entts => !!entts.length),
      first()
    );
  }

}
