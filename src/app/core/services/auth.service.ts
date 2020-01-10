import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { catchError, map, tap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_CODES } from 'src/app/enums/error-codes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn$: Observable<boolean>;

  constructor(
    private afAuthS: AngularFireAuth,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.afAuthS.authState.pipe(
      map(user => !!user)
    );
  }

  signIn({ email, password }: { email: string, password: string }): Observable<User> {
    return from(this.afAuthS.auth.signInWithEmailAndPassword(email, password)).pipe(
      map(userCreds => userCreds.user),
      map(user => ({ publicId: user.uid, displayName: user.displayName, email: user.email })),
      catchError((error: HttpErrorResponse) => throwError(error.message))
    );
  }

  signUp(email: string, password: string): Observable<User> {
    return from(this.afAuthS.auth.createUserWithEmailAndPassword(email, password)).pipe(
      map(userCreds => userCreds.user),
      map(user => ({ publicId: user.uid, displayName: user.displayName, email: user.email }))
    );
  }

  logout() {
    return from(this.afAuthS.auth.signOut()).pipe(
      tap(_ => this.router.navigateByUrl('/login'))
    );
  }
}
