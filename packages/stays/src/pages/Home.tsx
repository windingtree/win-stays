import type { LatLngTuple } from "leaflet";
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box } from 'grommet';
import { useState } from 'react';
import { WakuMessage } from "js-waku";
import { useWakuObserver } from "src/hooks/useWakuObserver";
import { processMessage } from "src/utils/waku";
import { geoToH3, kRing } from 'h3-js';
import { Bids } from "../proto/bidask";
import { Pong } from "../proto/pingpong";
import { address, videreConfig } from "../config";
import Logger from "src/utils/logger";
import { useDataDomain } from "../hooks/useDataDomain";
import { utils } from "@windingtree/videre-sdk"
// import { SignedMessage } from "@windingtree/videre-sdk/dist/cjs/utils";
import { ServiceProviderRegistry, ServiceProviderRegistry__factory } from '../typechain-videre';

const logger = Logger('Home');
const defaultCenter: LatLngTuple = [51.505, -0.09]

export const EIP712PongTypes = {
  Pong: [
    { name: "facilityHash", type: "bytes32" },
    { name: "geohash", type: "string" },
    { name: "timestamp", type: "uint64" }
  ]
}

export const Home = () => {
  const { isConnecting, waku, provider } = useAppState();
  const [lineRegistryDataDomain, serviceProviderDataDomain, loading, error] = useDataDomain();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter)

  const bidMessageHandler = (incomingMessage: WakuMessage): void => {
    try {
      const decodedMessage = processMessage<Bids>(
        Bids,
        incomingMessage
      );
      logger.info('bid message arrived', decodedMessage)
    } catch (error) {
      console.error(error);
    }
  };

  const pongMessageHandler = async (incomingMessage: WakuMessage): Promise<boolean> => {
    try {
      const decodedMessage = processMessage<Pong>(
        Pong,
        incomingMessage
      );
      logger.info('pong message arrived', decodedMessage)

      if (!serviceProviderDataDomain || !decodedMessage || !provider || !serviceProviderDataDomain.verifyingContract) {
      logger.error('not ready to handle Pong',!serviceProviderDataDomain, !decodedMessage, !provider,!serviceProviderDataDomain?.verifyingContract)
      return false
      }

      const registry: ServiceProviderRegistry = ServiceProviderRegistry__factory.connect(serviceProviderDataDomain.verifyingContract, provider)

      return await utils.verifyMessage(
        videreConfig.line,
        serviceProviderDataDomain,
        EIP712PongTypes,
        decodedMessage,
        async (signer: string) => {
          // todo: put enum into videre-sdk
          return await registry.can(decodedMessage.serviceProvider, 2, signer)
        }
      )

    } catch (error) {
      console.error(error);
      return false
    }
  };

  const h3 = geoToH3(center[0], center[1], utils.constants.DefaultH3Resolution);
  const h3Indexes = kRing(h3, utils.constants.DefaultRingSize)
  useWakuObserver(
    waku,
    bidMessageHandler,
    h3Indexes.map((h) => utils.generateTopic({ ...videreConfig, topic: 'bid' }, h))
  );
  useWakuObserver(
    waku,
    pongMessageHandler,
    h3Indexes.map((h) => utils.generateTopic({ ...videreConfig, topic: 'pong' }, h))
  );

  return (
    <PageWrapper kind='full'>
      {!isConnecting &&
        <Box>
          <Search center={center} onSubmit={setCenter} />
          <MapBox center={center} />
        </Box>
      }
    </PageWrapper>
  );
};
