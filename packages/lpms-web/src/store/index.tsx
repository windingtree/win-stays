import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useAppReducer } from './reducer';
import { useWaku } from '../hooks/useWaku';

export type AppReducerType = ReturnType<typeof useAppReducer>;
export type State = AppReducerType[0];
export type Dispatch = AppReducerType[1];

export const StateContext = createContext<State | null>(null);
export const DispatchContext = createContext<Dispatch | null>(null);

export const useAppState = () => {
  const ctx = useContext(StateContext);

  if (!ctx) {
    throw new Error('Missing state context');
  }

  return ctx;
};

export const useAppDispatch = () => {
  const ctx = useContext(DispatchContext);

  if (!ctx) {
    throw new Error('Missing dispatch context');
  }

  return ctx;
}

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useAppReducer();
  const waku = useWaku();

  useEffect(
    () => {
      dispatch({
        type: 'SET_CONNECTING',
        payload: !!!waku
      });
    },
    [dispatch, waku]
  );

  useEffect(
    () => {
      dispatch({
        type: 'SET_WAKU',
        payload: waku
      });
    },
    [dispatch, waku]
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
