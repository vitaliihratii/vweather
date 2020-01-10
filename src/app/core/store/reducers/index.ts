import { ActionReducerMap, MetaReducer  } from '@ngrx/store';
import { AppState } from '../state';
import { routerReducer  } from '@ngrx/router-store';
import { globalRangeReducer } from './home.reducers';
import { authReducer } from './auth.reducers';
import * as metaReducers from './meta.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  user: authReducer,
  router: routerReducer,
  globalRange: globalRangeReducer
};

export const appMetaReducers: MetaReducer<AppState>[] = [
  metaReducers.clearStoreMetaReducer,
  metaReducers.storageMetaReducer
];
