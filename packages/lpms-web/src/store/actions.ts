import type { Wallet } from 'ethers';
import type { StaticProvider } from '../hooks/useRpcProvider';
export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface State {
  isConnecting: boolean;
  staticProvider?: StaticProvider;
  wallet: string;
  walletAccountIndex: number;
  provider?: Wallet;
  account?: string;
  authentication: {
    token?: string;
    timestamp: number;
  };
  [key: string]: unknown | GenericStateRecord[];
}

export interface SetConnectingAction {
  type: 'SET_CONNECTING',
  payload: boolean;
}

export interface SetWalletAction {
  type: 'SET_WALLET',
  payload: string;
}

export interface SetWalletAccountIndexAction {
  type: 'SET_WALLET_ACCOUNT_INDEX',
  payload: number;
}

export interface SetWalletProviderAction {
  type: 'SET_WALLET_PROVIDER',
  payload?: Wallet;
}

export interface SetWalletAccountAction {
  type: 'SET_WALLET_ACCOUNT',
  payload?: string;
}

export interface SetStaticProviderAction {
  type: 'SET_STATIC_PROVIDER',
  payload?: StaticProvider;
}

export interface SetRecordAction {
  type: 'SET_RECORD';
  payload: {
    name: string;
    record: GenericStateRecord;
  }
}

export interface RemoveRecordAction {
  type: 'REMOVE_RECORD';
  payload: {
    name: string;
    id: string;
  }
}

export interface ResetRecordAction {
  type: 'RESET_RECORD';
  payload: {
    name: string;
  }
}

export interface SetAuthenticationTokenAction {
  type: 'SET_AUTHENTICATION_TOKEN';
  payload: {
    token?: string;
    timestamp: number;
  }
}

export type Action =
  | SetAuthenticationTokenAction
  | SetConnectingAction
  | SetWalletAction
  | SetWalletAccountIndexAction
  | SetWalletProviderAction
  | SetWalletAccountAction
  | SetStaticProviderAction
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction;
