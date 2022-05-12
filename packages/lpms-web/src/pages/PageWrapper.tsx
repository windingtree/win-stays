import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Page, PageContent, Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageLoadingBox } from '../components/MessageBox';
import { useAppState } from '../store';

export interface PageWrapperProps {
  children?: React.ReactNode,
  breadcrumbs?: Breadcrumb[];
}

export const PageWrapper = ({ children, breadcrumbs }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isConnecting } = useAppState();

  return (
    <Page kind='narrow'>
      <PageContent>
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          size={size}
        />
        <Box
          pad={{ top: 'small' }}
          fill='horizontal'
        >
          <MessageLoadingBox type='info' show={isConnecting}>
            The Dapp is connecting
          </MessageLoadingBox>
        </Box>
        {children}
      </PageContent>
    </Page>
  );
};
