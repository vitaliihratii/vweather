import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeSet, EntityCacheDataService, EntityDefinitionService } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CityService } from 'src/app/core/services/city.service';
import { userSelector } from 'src/app/core/store/selectors/auth.selectors';
import { AppState } from 'src/app/core/store/state';
import { City } from 'src/app/models/city';

@Injectable()
export class CityCacheDataService extends EntityCacheDataService {

  constructor(
    protected entityDefinitionService: EntityDefinitionService,
    protected http: HttpClient,
    private store: Store<AppState>,
    private cityS: CityService
  ) {
    super(entityDefinitionService, http);
  }
  
  saveEntities(changeSet: ChangeSet<City>, url: string): Observable<ChangeSet<City>> {
    const cities = changeSet.changes[0].entities as City[];

    return this.store.pipe(
      select(userSelector),
      map(user => user.id),
      switchMap(id => this.cityS.addUserCities(id, cities)),
      tap(r => console.log(changeSet)),
      map(() => changeSet)
    )
  }
}
