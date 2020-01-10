import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';
import { HttpErrorResponse } from '@angular/common/http';


export const signin = createAction(
  '[SignIn Page] User SignIn',
  props<{ user: User }>()
);


export const signout = createAction(
  '[Sidebar] SignOut'
);

export const signup = createAction(
  '[SignUp Page] User SignUp',
  props<{ email: string, password: string }>()
);

export const signupError = createAction(
  '[SignUp Page] User SignUp Failed',
  props<{error: string}>()
);

export const createUser = createAction(
  '[SignUp Page] User create initialized',
  props<{user: User}>()
);

export const userLoaded = createAction(
  '[Sign Pages] User profile loaded',
  props<{ user: User }>()
);
