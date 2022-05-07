import type { Waku } from '../hooks/useWaku';

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface State {
  isConnecting: boolean;
  waku?: Waku;
  [key: string]: unknown | GenericStateRecord[];
}

export interface SetConnectingAction {
  type: 'SET_CONNECTING',
  payload: boolean;
}

export interface SetWakuAction {
  type: 'SET_WAKU',
  payload?: Waku;
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

export type Action =
  | SetConnectingAction
  | SetWakuAction
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction;
