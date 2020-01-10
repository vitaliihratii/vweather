import { createReducer, on, Action } from '@ngrx/store';
import { DATE_RANGES } from 'src/app/models/date-ranges';
import * as homeActions from '../actions/home.actions';

export interface HomeState {
  globalRange: string;
}

export const initialHomeState: HomeState = {
  globalRange: DATE_RANGES.CURRENT
};

const reducer = createReducer(
  initialHomeState,

  on(homeActions.globalRangeChanged, (state, action) => {
    return { ...state, globalRange: action.range };
  })
);

export function globalRangeReducer(state: HomeState, action: Action) {
  return reducer(state, action);
}
