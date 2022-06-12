import type { LatLngTuple } from "leaflet";
import { useAppState } from '../store';
import { Box } from 'grommet';
import { WakuMessage } from "js-waku";
import { useWakuObserver } from "src/hooks/useWakuObserver";
import { processMessage } from "src/utils/waku";
import { geoToH3, kRing } from 'h3-js';
import { Bids } from "../proto/bidask";
import { Pong } from "../proto/pingpong";
import { videreConfig } from "../config";
import Logger from "../utils/logger";
import { utils } from "@windingtree/videre-sdk"
import { ServiceProviderRegistry, ServiceProviderRegistry__factory } from '../typechain-videre';

export const EIP712PongTypes = {
  Pong: [
    { name: "facilityHash", type: "bytes32" },
    { name: "geohash", type: "string" },
    { name: "timestamp", type: "uint64" }
  ]
}

const logger = Logger('Results');

export const Results: React.FC<{
  center: LatLngTuple
}> = ({ center }) => {
  const { waku, provider, serviceProviderDataDomain } = useAppState();

  const bidMessageHandler = (incomingMessage: WakuMessage): void => {
    try {
      const decodedMessage = processMessage<Bids>(
        Bids,
        incomingMessage
      );
      logger.info('Bid message arrived', decodedMessage)
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
      logger.info('Pong message arrived', decodedMessage)

      if (!serviceProviderDataDomain || !decodedMessage || !provider || !serviceProviderDataDomain.verifyingContract) {
        logger.error('not ready to handle Pong', !serviceProviderDataDomain, !decodedMessage, !provider, !serviceProviderDataDomain?.verifyingContract)
        return false
      }

      const registry: ServiceProviderRegistry = ServiceProviderRegistry__factory.connect(serviceProviderDataDomain.verifyingContract, provider)

      return await utils.verifyMessage(
        videreConfig.line,
        serviceProviderDataDomain,
        EIP712PongTypes,
        decodedMessage,
        async (signer: string) => {
          return await registry.can(decodedMessage.serviceProvider, utils.constants.AccessRoles.BIDDER_ROLE, signer)
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
  return <Box>HERE</Box>;
};
