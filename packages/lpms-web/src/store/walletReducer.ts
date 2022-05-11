import type { Action, State } from './actions';

export const walletReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_WALLET':
        return {
          ...state,
          wallet: action.payload
        };
      case 'SET_WALLET_ACCOUNT_INDEX':
        return {
          ...state,
          walletAccountIndex: action.payload
        };
      case 'SET_WALLET_PROVIDER':
        return {
          ...state,
          provider: action.payload
        };
      case 'SET_WALLET_ACCOUNT':
        return {
          ...state,
          account: action.payload
        };
      default:
        return state;
    }
  } catch(error) {
    return state;
  }
};
