import { createFeatureSelector } from '@ngrx/store';
import { AppState } from '../state';
import { RouterReducerState } from '@ngrx/router-store';
import { Params } from '@angular/router';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export const RouterStateSelector = createFeatureSelector<
  AppState,
  RouterReducerState<RouterStateUrl>
>('router');
