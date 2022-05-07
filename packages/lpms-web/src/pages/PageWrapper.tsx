import type { ReactNode } from 'react';
import { useAppState } from '../store';

export interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { isConnecting } = useAppState();

  return (
    <div>
      {isConnecting &&
        <div>
          The Dapp connecting to peers
        </div>
      }
      {children}
    </div>
  );
};
