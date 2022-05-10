export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface State {
  isConnecting: boolean;
  [key: string]: unknown | GenericStateRecord[];
}

export interface SetConnectingAction {
  type: 'SET_CONNECTING',
  payload: boolean;
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
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction;
