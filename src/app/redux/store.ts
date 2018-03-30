import { ISession } from './session'
import { ADD_SESSION, REMOVE_SESSION } from './actions';

export interface LoginState {
  session: ISession;
  isLogged: boolean;
}

export const INITIAL_STATE: LoginState = {
  session: {
    token: undefined,
    name: undefined,
    photo: undefined,
    type: undefined
  },
  isLogged: false
}

export function rootReducer(state: LoginState, action): LoginState {
  switch (action.type) {
    case ADD_SESSION:
      return Object.assign({}, state, { session: action.session, isLogged: true });
    case REMOVE_SESSION:
      return Object.assign({}, state, INITIAL_STATE);
  }
  return state;
}
