import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Box } from 'grommet';
import { useAppState } from '../store';
import { MessageBox } from '../components/MessageBox';
import { name } from '../config';

export interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { isConnecting, isRightNetwork } = useAppState();

  return (
    <Box>
      <Header />
      <Box
        margin={{ left: 'auto', right: 'auto', bottom: 'xlarge' }}
        pad={{ horizontal: 'small' }}
        width={{ width: '100%', max: '900px' }}
      >
        <MessageBox type='info' show={isConnecting}>
          Connecting...
        </MessageBox>
        <MessageBox type='warn' show={!isRightNetwork}>
          You are connected to a wrong network. Please switch to: {name}
        </MessageBox>
        {children}
      </Box>
    </Box>
  );
};
