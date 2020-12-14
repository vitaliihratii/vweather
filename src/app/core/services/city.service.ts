import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, first, switchMap, filter, withLatestFrom, tap } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { Capital } from 'src/app/models/capital';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { AngularFirestore } from '@angular/fire/firestore';
import { City } from 'src/app/models/city';
import { FirestoreService } from './firestore.service';
import { DataServiceError, EntityDispatcherDefaultOptions } from '@ngrx/data';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(
    private http: HttpClient,
    private af: AngularFirestore,
    private fsS: FirestoreService
  ) { }

  getCountriesCapitals(query: string): Observable<Capital[]> {
    return this.http.get<Capital[]>(`https://restcountries.eu/rest/v2/capital/${query}`).pipe(
      catchError((err: HttpErrorResponse) => err.status === 404 ? throwError(ERROR_CODES.CITY_NOTFOUND) : throwError(err.message))
    );
  }

  getUserCities(userId: string): Observable<City[]> {
    return this.af.collection(`users/${userId}/cities`)
      .snapshotChanges()
      .pipe(
        first(),
        map(snaps => this.fsS.transformSnapshots<City>(snaps) ),
      );
  }

  addUserCities(userId: string, cities: City[]): Observable<void> {
    const batch = this.af.firestore.batch();
    const userCities = this.af.doc(`users/${userId}`).collection('cities');
    const userCitiesRef = userCities.doc<City>('random').ref;
    
    cities.forEach((city, i) => batch.set(userCities.doc<City>(`${city.id}`).ref, city));

    return from(batch.commit())
  }

  
  deleteCityUser(userId: string, cityId: string): Observable<any> {
    return from(this.af.doc(`users/${userId}/cities/${cityId}`).delete());
  }

  generateEntity(name: string): City {
    return {
      id: this.af.createId(),
      name
    }
  }
}
