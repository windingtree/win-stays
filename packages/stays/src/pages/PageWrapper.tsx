import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import { useAppState } from '../store';
import { name } from '../config';

export interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { isConnecting, isRightNetwork } = useAppState();

  return (
    <div>
      <Header />
      {isConnecting &&
        <div>
          Connecting...
        </div>
      }
      {!isRightNetwork &&
        <div>
          Please connect you wallet to the {name}
        </div>
      }
      {children}
    </div>
  );
};
