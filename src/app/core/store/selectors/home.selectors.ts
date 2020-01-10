import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeState } from '../reducers/home.reducers';


export const globalRangeState = createFeatureSelector<HomeState>('globalRange');

export const globalRangeSelector = createSelector(
  globalRangeState,
  globalRange => globalRange
);
