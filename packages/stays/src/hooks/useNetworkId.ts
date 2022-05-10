import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

const logger = Logger('useNetworkId');

export type NetworkIdHook = [
  networkId: undefined | number,
  isNetworkIdLoading: boolean,
  isRightNetwork: boolean,
  error: undefined | string
];

// useNetworkId react hook
export const useNetworkId = (
  provider: undefined | Web3ModalProvider,
  allowedNetwork: number
): NetworkIdHook => {
  const [networkId, setNetworkId] = useState<undefined | number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRightNetwork, setIsRightNetwork] = useState<boolean>(true);
  const [error, setError] = useState<undefined | string>();

  useEffect(() => {
    setError(undefined);

    if (!provider) {
      return setNetworkId(undefined);
    }

    const getNetworkId = async () => {
      try {
        setIsLoading(true);
        const network = await provider.getNetwork();
        setIsLoading(false);
        logger.debug('getNetwork:', network);

        if (network) {

          if (allowedNetwork === network.chainId) {
            setNetworkId(network.chainId);
            setIsRightNetwork(true);
          } else {
            throw new Error(
              `Invalid network ${network.chainId} though expected ${allowedNetwork}`
            );
          }
        } else {
          setNetworkId(undefined);
          setIsRightNetwork(false);
        }
      } catch (error) {
        setIsLoading(false);
        setNetworkId(undefined);
        setIsRightNetwork(false);

        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    getNetworkId();
  }, [provider, allowedNetwork]);

  return [
    networkId,
    isLoading,
    isRightNetwork,
    error
  ];
};
