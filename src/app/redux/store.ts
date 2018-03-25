import { ISession } from './session'
import { ADD_SESSION, REMOVE_SESSION } from './actions';

export interface IAppState {
  session: ISession;
}

export const INITIAL_SESSION: IAppState = {
  session: {
      id: undefined,
      name: undefined,
      type: undefined
  }
}

export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case ADD_SESSION:
      action.session.id = Math.floor(Math.random());
      return Object.assign({}, state, {
        session: action.session
      });
    case REMOVE_SESSION:
      return Object.assign({}, state, INITIAL_SESSION);
  }
  return state;
}
