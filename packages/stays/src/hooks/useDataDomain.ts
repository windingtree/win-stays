import { useState, useEffect } from 'react';
import { providers } from 'ethers';
import Logger from '../utils/logger';
import { address, videreConfig } from '../config';
import { useAppState } from '../store';
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { LineRegistry__factory } from '../typechain-videre';

const logger = Logger('useLineRegistryDataDomain');

export type StaticProvider = providers.JsonRpcProvider;

export type UseDataDomain = [
  lineRegistryDataDomain: TypedDataDomain | undefined,
  serviceProviderDataDomain: TypedDataDomain | undefined,
  loading: boolean,
  error: string | undefined
];

export const useDataDomain = (): UseDataDomain => {
  const { provider, networkId } = useAppState();

  const [serviceProviderDataDomain, setServiceProviderDataDomain] = useState<TypedDataDomain>();
  const [lineRegistryDataDomain, setLineRegistryDataDomain] = useState<TypedDataDomain>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!provider || !networkId) {
      return
    }
    const getServiceProviderRegistry = async () => {
      try {
        logger.error('init data domain...');
        setError(undefined);
        setLoading(true);
        const serviceProviderRegistry = await LineRegistry__factory.connect(
          address,
          provider
        ).serviceProviderRegistry();

        setServiceProviderDataDomain({
          name: videreConfig.line,
          version: String(videreConfig.version),
          verifyingContract: serviceProviderRegistry,
          chainId: Number(networkId)
        })
        setLineRegistryDataDomain({
          name: videreConfig.line,
          version: String(videreConfig.version),
          verifyingContract: address,
          chainId: Number(networkId)
        })
        setLoading(false);
        logger.info(`Network ID: ${networkId}`);
        logger.info(`Line registry: ${address}`);
        logger.info(`Service Provider registry: ${serviceProviderRegistry}`);
      } catch (err) {
        setError((err as Error).message || 'Unknown error');
        setLoading(false);
        logger.error('Unknown error');
      }
    }
    getServiceProviderRegistry()
  }, [provider, networkId])

  return [lineRegistryDataDomain, serviceProviderDataDomain, loading, error];
};

