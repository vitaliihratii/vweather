import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('user');

export const userSelector = createSelector(
  selectAuthState,
  state => state.user
);

export const userErrorSelector = createSelector(
  selectAuthState,
  state => state.error
);

export const isLoggedIn = createSelector(
  userSelector,
  state => !!state
);

export const isLoggedOut = createSelector(
  selectAuthState,
  state => !state.user
);

