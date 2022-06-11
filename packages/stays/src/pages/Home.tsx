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
import { generateTopic } from "@windingtree/videre-sdk/dist/cjs/utils";
import { videreConfig } from "src/config";
import Logger from "src/utils/logger";
import { DefaultH3Resolution, DefaultRingSize } from "@windingtree/videre-sdk/dist/cjs/utils/constants";

const logger = Logger('Home');
const defaultCenter: LatLngTuple = [51.505, -0.09]

export const Home = () => {
  const { isConnecting, waku } = useAppState();
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

  const pongMessageHandler = (incomingMessage: WakuMessage): void => {
    try {
      const decodedMessage = processMessage<Pong>(
        Pong,
        incomingMessage
      );
      logger.info('pong message arrived', decodedMessage)
    } catch (error) {
      console.error(error);
    }
  };

  const h3 = geoToH3(center[0], center[1], DefaultH3Resolution);
  const h3Indexes = kRing(h3, DefaultRingSize)
  useWakuObserver(
    waku,
    bidMessageHandler,
    h3Indexes.map((h) => generateTopic({ ...videreConfig, topic: 'bid' }, h))
  );
  useWakuObserver(
    waku,
    pongMessageHandler,
    h3Indexes.map((h) => generateTopic({ ...videreConfig, topic: 'pong' }, h))
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
