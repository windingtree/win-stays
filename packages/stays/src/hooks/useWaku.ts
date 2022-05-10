import type { CreateOptions } from 'js-waku/build/main/lib/waku';
import { useState, useEffect } from 'react';
import { Waku } from 'js-waku';
import Logger from '../utils/logger';

const logger = Logger('useWaku');

export type { Waku };

export const useWaku = (options?: CreateOptions): undefined | Waku => {
  const [waku, setWaku] = useState<undefined | Waku>();

  useEffect(
    () => {
      let wakuInstance: Waku;
      logger.debug('Waku start');

      Waku.create({
        bootstrap: {
          default: true
        },
        ...options ?? {}
      })
        .then(w => {
          wakuInstance = w;
          return w.waitForRemotePeer();
        })
        .catch(logger.error)
        .finally(() => {
          logger.debug(wakuInstance);
          setWaku(wakuInstance)
        });

      return () => {
        if (wakuInstance !== undefined) {
          logger.debug('Waku stop');
          wakuInstance
            .stop()
            .catch(logger.error);
        }
      };
    },
    [options]
  );

  return waku;
};
