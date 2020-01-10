import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private af: AngularFirestore,
    private fsS: FirestoreService
  ) { }

  getUser(publicId: string): Observable<User> {
    return this.af.collection('users', ref => ref.where('publicId', '==', publicId))
      .snapshotChanges()
      .pipe(
        map(snaps => this.fsS.transformSnapshots<User>(snaps)),
        map(snaps => snaps.length === 1 ? <User>snaps[0] : undefined),
        first()
      );
  }

  createUser(user: User): Observable<User> {
    return from(this.af.collection('users').add(user)).pipe(
      switchMap(userRef => userRef.get()),
      map(userDoc => <User>userDoc.data())
    );
  }
}
