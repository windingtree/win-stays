import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import { useAppState } from '../store';

export interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { isConnecting } = useAppState();

  return (
    <div>
      <Header />
      {isConnecting &&
        <div>
          The Dapp is connecting
        </div>
      }
      {children}
    </div>
  );
};
