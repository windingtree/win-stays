import axios from "axios";
import Logger from '../utils/logger';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import { apiUrl } from '../config';

const logger = Logger('useRefreshAuth');
const path = '/api/user/refresh';

export type UseRefreshAuthHook = [
  load: () => void,
  loading: boolean,
  error?: string
];

export const useRefreshAuth = (): UseRefreshAuthHook => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(undefined);

      try {
        const res = await axios.post(apiUrl + path)
        //@todo handle res errors

        dispatch({
          type: 'SET_AUTHENTICATION_TOKEN',
          payload: {
            token: res.data.accessToken,
            timestamp: Math.round(Date.now() / 1000)
          }
        });
        setLoading(false);
      } catch (error) {
        logger.error(error);
        const message = (error as Error).message || 'Unknown useRefreshAuth error'
        setError(message);
        setLoading(false);
      }
    },
    [setError, setLoading, dispatch]
  );
  return [load, loading, error]
};
