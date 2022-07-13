import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Page, PageContent, Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageLoadingBox, MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';
import { name } from '../config';

export interface PageWrapperProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  kind?: string;
}

export const PageWrapper = ({ children, breadcrumbs, kind }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, isRightNetwork } = useAppState();

  return (
    <Page height={{ min: '75vh' }} kind={kind ?? 'narrow'}>
      <PageContent pad='none'>
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          size={size}
        />
        <Box fill='horizontal'>
          <MessageLoadingBox type='info' show={isConnecting}>
            The Dapp is connecting
          </MessageLoadingBox>
          <MessageBox type='warn' show={!isRightNetwork}>
            You are connected to a wrong network. Please switch to: {name}
          </MessageBox>
        </Box>
        {children}
      </PageContent>
    </Page>
  );
};
