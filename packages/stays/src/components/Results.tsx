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
import { utils as vUtils, eip712 } from "@windingtree/videre-sdk"
import { ServiceProviderRegistry, ServiceProviderRegistry__factory } from '../typechain-videre';
import { LatLng } from "../proto/latlng";
import { utils } from "ethers";

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

  const pongMessageHandler = async (incomingMessage: WakuMessage): Promise<void> => {
    try {
      const decodedMessage = processMessage<Pong>(
        Pong,
        incomingMessage
      );
      logger.info('Pong message arrived', decodedMessage)

      if (!decodedMessage) {
        throw new Error('decodedMessage if undefined');
      }

      if (!videreConfig.line || !serviceProviderDataDomain || !provider || !serviceProviderDataDomain.verifyingContract) {
        throw new Error('not ready to handle Pong');
      }

      const registry: ServiceProviderRegistry = ServiceProviderRegistry__factory.connect(serviceProviderDataDomain.verifyingContract, provider)
      const res = await vUtils.verifyMessage(
        decodedMessage.serviceProvider,
        {
          name: 'stays',
          version: '1',
          verifyingContract: '0xE7de8c7F3F9B24F9b8b519035eC53887BE3f5443',
          chainId: 77
        },
        eip712.pingpong.Pong,
        decodedMessage,
        async (which: Uint8Array, who: string) => {
          return vUtils.auth.isBidder(registry, utils.hexlify(which), who)
        }
      )
      logger.info('signature verification', res)
      if (!!res) {
        const loc = LatLng.fromBinary(decodedMessage.loc)
        console.log('LOC HERE', loc)
        // dispatch({

        // })

      } else {

      }

    } catch (error) {
      console.error(error);
    }
  };

  const h3 = geoToH3(center[0], center[1], vUtils.constants.DefaultH3Resolution);
  const h3Indexes = kRing(h3, vUtils.constants.DefaultRingSize)
  useWakuObserver(
    waku,
    bidMessageHandler,
    h3Indexes.map((h) => vUtils.generateTopic({ ...videreConfig, topic: 'bid' }, h))
  );
  useWakuObserver(
    waku,
    pongMessageHandler,
    h3Indexes.map((h) => vUtils.generateTopic({ ...videreConfig, topic: 'pong' }, h))
  );
  return <Box>HERE</Box>;
};
