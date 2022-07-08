import type { TypedDataDomain } from "@ethersproject/abstract-signer";
import type { Waku } from '../hooks/useWaku';
import type { StaticProvider } from '../hooks/useRpcProvider';
import type {
  Web3ModalProvider,
  Web3ModalSignInFunction,
  Web3ModalSignOutFunction
} from '../hooks/useWeb3Modal';
import { Facility as FacilityMetadata, Space } from "../proto/facility";

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface Facility extends FacilityMetadata {
  id: string;
  spaces: Space[];
}

export interface State {
  isConnecting: boolean;
  waku?: Waku;
  staticProvider?: StaticProvider;
  provider?: Web3ModalProvider;
  signIn?: Web3ModalSignInFunction;
  signOut?: Web3ModalSignOutFunction;
  networkId?: number;
  isRightNetwork: boolean;
  account?: string;
  serviceProviderDataDomain?: TypedDataDomain;
  facilities: Facility[];
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

export interface SetStaticProviderAction {
  type: 'SET_STATIC_PROVIDER',
  payload?: StaticProvider;
}

export interface SetProviderAction {
  type: 'SET_PROVIDER',
  payload?: Web3ModalProvider;
}

export interface SetWeb3ModalSignInAction {
  type: 'SET_WEB3MODAL_SIGN_IN',
  payload?: Web3ModalSignInFunction;
}

export interface SetWeb3ModalSignOutAction {
  type: 'SET_WEB3MODAL_SIGN_OUT',
  payload?: Web3ModalSignOutFunction;
}

export interface SetIsRightNetworkAction {
  type: 'SET_IS_RIGHT_NETWORK',
  payload: boolean;
}

export interface SetNetworkIdAction {
  type: 'SET_NETWORK_ID',
  payload: number | undefined;
}

export interface SetAccountAction {
  type: 'SET_ACCOUNT',
  payload: string | undefined;
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

export interface SetServiceProvider {
  type: 'SET_SERVICE_PROVIDER';
  payload: TypedDataDomain | undefined;
}

export type Action =
  | SetConnectingAction
  | SetWakuAction
  | SetStaticProviderAction
  | SetProviderAction
  | SetWeb3ModalSignInAction
  | SetWeb3ModalSignOutAction
  | SetIsRightNetworkAction
  | SetNetworkIdAction
  | SetAccountAction
  | SetRecordAction
  | RemoveRecordAction
  | ResetRecordAction
  | SetServiceProvider;
