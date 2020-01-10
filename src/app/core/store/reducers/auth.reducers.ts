import { User } from 'src/app/models/user';
import { createReducer, on, Action, State } from '@ngrx/store';
import { AuthActions } from '../actions/action.types';

export interface AuthState {
  user: User;
  error: null | string;
}

export const initialAuthState: AuthState = {
  user: undefined,
  error: null
};

const reducer = createReducer(

  initialAuthState,

  on(AuthActions.userLoaded, (state, action) => {
    return {
      ...state,
      user: action.user,
      error: null
    };
  }),

  on(AuthActions.signupError, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),

  on(AuthActions.createUser, (state, action) => {
    return {
      ...state,
      error: null
    };
  })
);

export function authReducer (state: AuthState, action: Action) {
  return reducer(state, action);
}
