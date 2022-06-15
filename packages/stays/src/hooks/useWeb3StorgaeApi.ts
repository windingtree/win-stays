import { Web3Storage } from 'web3.storage'
import { useMemo } from 'react';
import { web3StorageKey } from '../config';

export const useWeb3StorageApi = (): Web3Storage => useMemo(
  () => new Web3Storage({token: web3StorageKey}),
  []
);
