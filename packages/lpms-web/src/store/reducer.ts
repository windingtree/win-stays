import type { Reducer } from 'react';
import type { Action, State } from './actions';
import { useReducer } from 'react';
import { recordsReducer } from './recordsReducer';
import { getState, storageReducer } from './localStorage';
import { walletReducer } from './walletReducer';
import Logger from '../utils/logger';

const logger = Logger('Reducer');

export const mainReducer = (state: State, action: Action): State => {
  const type = action.type;
  logger.debug('Action:', type, action.payload);

  try {
    switch (type) {
      case 'SET_CONNECTING':
        return {
          ...state,
          isConnecting: action.payload
        };
      case 'SET_STATIC_PROVIDER':
        return {
          ...state,
          staticProvider: action.payload
        };
      case 'SET_AUTHENTICATION_TOKEN':
        return {
          ...state,
          authentication: action.payload
        };
      default:
        return state;
    }
  } catch (error) {
    return state;
  }
};

const initialState: State = {
  isConnecting: false,
  wallet: '',
  walletAccountIndex: 0,
  authentication: {
    timestamp: 0

  },
};

export const combineReducers = (
  reducers: Reducer<State, Action>[]
): Reducer<State, Action> =>
  (state: State, action: Action): State => {
    let updatedState = state;

    for (const reducer of reducers) {
      updatedState = reducer(updatedState, action);
    }

    return updatedState;
  };

export const useAppReducer = () => {
  const storedState = getState(); // Restoration of the Dapp state

  return useReducer(
    combineReducers(
      [
        mainReducer,
        walletReducer,
        recordsReducer,
        storageReducer() // Always must be the last
      ]
    ),
    {
      ...initialState,
      ...storedState
    }
  );
};
