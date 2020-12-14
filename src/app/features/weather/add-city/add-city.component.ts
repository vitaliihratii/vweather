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
import { City } from 'src/app/models/city';
import { ChangeSet, ChangeSetItem, changeSetItemFactory, ChangeSetOperation, EntityCacheDispatcher } from '@ngrx/data';

@Component({
  selector: 'vwe-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {

  capitals$: Observable<Capital[]>;
  errMsgSubj: Subject<string> = new Subject();
  addCitySubj: Subject<string> = new Subject();
  addCity$: Observable<ChangeSet<City>>;
  cityAddedSuccess$: Observable<any>;
  citySearchCtrl: FormControl;
  topCityWeather$: Observable<CurrentWeather>;
  topCityAdded$: Observable<boolean>;
  private user$: Observable<string>;
  private chosenCities: Set<string> = new Set();
  readonly topCity = 'Kiev';


  constructor(
    private cityS: CityService,
    private guidS: GuidService,
    private weatherS: WeatherService,
    private wes: WeatherEntityService,
    private cacheEntityDispatcher: EntityCacheDispatcher,
    private store: Store<AppState>,
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
      switchMap(val => this.getCities(val))
    );

    this.topCityWeather$ = this.weatherS.getWeather(this.topCity);
    this.topCityAdded$ = this.wes.entities$.pipe(
      map(entts => entts.find(entt => entt.name === this.topCity) ? true : false)
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

    this.addCity$ = this.addCitySubj.pipe(
      filter(() => Boolean(this.chosenCities.size)),
      switchMap(() => this.cacheEntityDispatcher.saveEntities(this.citiesChangeSet, '')),
      tap(_ => this.chosenCities.clear()),
      tap(_ => this.citySearchCtrl.setValue('')),
      tap(_ => cityAddSuccessSubj.next('Selected cities was added to your list'))
    );

  }

  getCities(query: string): Observable<Capital[]> {
    return this.cityS.getCountriesCapitals(query).pipe(
      withLatestFrom(this.wes.entities$),
      map(([capitals, entts]) => {
        capitals.forEach((capital: Capital) => capital.disabled = !!entts.find(city => city.name === capital.capital))
        return capitals;
      }),
      catchError((err, source) => {
        if (err === ERROR_CODES.CITY_NOTFOUND && query) {
          this.errMsgSubj.next(err);
        }
        return of([]);
      }),
    );
  }

  toggleChosenCity (city: string) {
    if (this.chosenCities.has(city)) {
      this.chosenCities.delete(city);
    } else {
      this.chosenCities.add(city);
    }
  }

  get isAnyCitySelected (): boolean {
    return !!this.chosenCities.size;
  }

  get citiesChangeSet(): ChangeSet<City> {
    const changes: ChangeSetItem[] = [{
      op: ChangeSetOperation.Add,
      entityName: 'City',
      entities: [...this.chosenCities].map(city => this.cityS.generateEntity(city))
    }];
    return {
      changes
    } 
  }
}
