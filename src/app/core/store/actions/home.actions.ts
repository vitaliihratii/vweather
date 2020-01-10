import { createAction, props } from '@ngrx/store';


export const globalRangeChanged = createAction(
  "[App Header] Range Change",
  props<{range: string}>()
);

