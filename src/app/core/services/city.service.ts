import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, first, switchMap, filter } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { Capital } from 'src/app/models/capital';
import { ERROR_CODES } from 'src/app/enums/error-codes';
import { AngularFirestore } from '@angular/fire/firestore';
import { City } from 'src/app/models/city';
import { FirestoreService } from './firestore.service';
import { DataServiceError, EntityDispatcherDefaultOptions } from '@ngrx/data';

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

  addCityUser(userId: string, city: City): Observable<City> {
    return from(this.af.doc(`users/${userId}`)
      .collection('cities')
      .add(city))
      .pipe(
        switchMap(docRef => docRef.get()),
        map((doc) => ({ ...<City>doc.data(), id: doc.id }))
      );
  }

  
  deleteCityUser(userId: string, cityId: string): Observable<any> {
    debugger
    return from(this.af.doc(`users/${userId}/cities/${cityId}`).delete());
  }


  // isCityAdded(userId: string, cityName: string): Observable<boolean> {
  //   return from(this.af.collection(`users/${userId}/cities`, ref => ref.where('name', '==', cityName))
  //     .snapshotChanges()
  //     .pipe(
  //       first(),
  //       map(snaps => !!snaps.length)
  //     )
  //   );
  // }
}
