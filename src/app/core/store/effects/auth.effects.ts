import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthActions } from '../actions/action.types';
import { switchMap, map, tap, catchError, mergeMap } from 'rxjs/operators';
import { signin, userLoaded, signupError, createUser } from '../actions/auth.actions';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(action =>
        this.authS.signUp(action.email, action.password).pipe(
          map(user => createUser({user})),
          catchError((error: HttpErrorResponse) => {
            return of(signupError({ error: error.message }));
          }),
        )
      ),
    )
  );

  signin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signin),
      switchMap(action => this.userS.getUser(action.user.publicId)),
      map((user: User) => userLoaded({ user })),
      tap(_ => this.router.navigateByUrl('/home')),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createUser),
      switchMap(user => this.userS.createUser(user.user)),
      map((user: User) => signin({ user })),
    )
  );

  constructor(
    private actions$: Actions,
    private authS: AuthService,
    private userS: UserService,
    private router: Router,
  ) {
  }
}
