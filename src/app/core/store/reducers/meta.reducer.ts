import { ActionReducer, Action } from '@ngrx/store';
import { initialAppState } from '../state';


export function clearStoreMetaReducer (reducer: ActionReducer<any, Action>) {
  return function (state: any, action: Action) {
    let newState = Object.assign({}, state);
    if (action.type === '[Sidebar] SignOut') {
      newState = initialAppState;
    }
    return reducer(newState, action);
  };
}



/////////////////////////////////////
//            Refactor             //
/////////////////////////////////////
const stateKeys = ['user.user'];
const localStorageKey = '__app_storage__';

export function storageMetaReducer<Object, A extends Action = Action> (reducer: ActionReducer<Object, A>) {
  let onInit = true;

  return function (state: Object, action: A): Object {
    if (action.type === '[Sidebar] SignOut') return reducer(state, action);

    const nextState = reducer(state, action);
    if (onInit) {
      onInit = false;
      const savedState = getSavedState(localStorageKey);
      return Object.assign(nextState, savedState);
    }
    const stateToSave = pick(nextState, stateKeys);
    setSavedState(stateToSave, localStorageKey);
    return nextState;
  };
}

function setSavedState (state: any, lSKey: string) {
  if (state) {
    localStorage.setItem(lSKey, JSON.stringify(state));
  }
}
function getSavedState (lSKey: string): Object {
  return JSON.parse(localStorage.getItem(lSKey));
}
function pick (source: Object, keys: string[]) {
  let filteredSource = {};

  keys.forEach(key => {
    const keyParts = key.split('.');
    if (source[keyParts[0]][keyParts[1]] !== undefined) {
      filteredSource[keyParts[0]] = { [keyParts[1]]: source[keyParts[0]][keyParts[1]] };
    }
  });

  return filteredSource;
}
