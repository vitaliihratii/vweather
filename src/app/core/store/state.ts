import { RouterReducerState, BaseRouterStoreState } from '@ngrx/router-store';
import { HomeState, initialHomeState } from './reducers/home.reducers';
import { AuthState, initialAuthState } from './reducers/auth.reducers';

export interface AppState {
  user: AuthState;
  router: RouterReducerState<BaseRouterStoreState>;
  globalRange: HomeState;
}

export const initialAppState: AppState = {
  user: initialAuthState,
  globalRange: initialHomeState,
  router: undefined
};