import type { Waku, WakuMessage } from 'js-waku';
import { useEffect } from 'react';
import Logger from '../utils/logger';

const logger = Logger('useWakuObserver');

export type WakuMessageHandler = (message: WakuMessage) => void;

export const useWakuObserver = (
  waku: undefined | Waku,
  messageHandler: WakuMessageHandler,
  topics: string[]
): void => {
  useEffect(
    () => {
      if (!waku) return;

      waku.relay.addObserver(messageHandler, topics);
      logger.debug('Subscribed to topics:', topics);

      return () => {
        waku.relay.deleteObserver(messageHandler, topics);
        logger.debug('Unsubscribed from topics:', topics);
      };
    },
    [waku, messageHandler, topics]
  );
};
