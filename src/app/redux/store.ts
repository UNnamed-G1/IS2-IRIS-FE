import { ISession } from './session'
import { ADD_SESSION, ADD_AUXILIAR, REMOVE_SESSION, REMOVE_AUXILIAR } from './actions';

export interface AppState {
  session: ISession;
  auxiliarID: number;
  isLogged: boolean;
}

export const INITIAL_STATE: AppState = {
  session: {
    token: undefined,
    name: undefined,
    photo: undefined,
    type: undefined
  },
  auxiliarID: undefined,
  isLogged: false
}

export function rootReducer(state: AppState, action): AppState {
  switch (action.type) {
    case ADD_SESSION:
      return Object.assign({}, state, { session: action.session, isLogged: true });
    case ADD_AUXILIAR:
      return Object.assign({}, state, { auxiliarID: action.auxiliarID });
    case REMOVE_SESSION:
      return Object.assign({}, state, INITIAL_STATE);
    case REMOVE_AUXILIAR:
      return Object.assign({}, state, { auxiliarID: undefined });
  }
  return state;
}
