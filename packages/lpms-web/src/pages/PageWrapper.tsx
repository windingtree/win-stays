import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext, useEffect } from 'react';
import { Page, PageContent, Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageLoadingBox } from '../components/MessageBox';
import { useAppState } from '../store';
import { useNavigate } from 'react-router-dom';
import { useRefreshAuth } from '../hooks/useRefreshAuth';
import { expiredTimestamp } from '../config';

export interface PageWrapperProps {
  children?: React.ReactNode,
  breadcrumbs?: Breadcrumb[];
}

export const PageWrapper = ({ children, breadcrumbs }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, authentication } = useAppState();
  const navigate = useNavigate();
  const [load] = useRefreshAuth();

  useEffect(() => {
    if (authentication.token === undefined) {
      navigate('/login')
    }
    if (authentication.token !== undefined && authentication.timestamp < expiredTimestamp) {
      load()
    }
    if (authentication.token !== undefined && authentication.timestamp > expiredTimestamp) {
      navigate('/')
    }
  }, [authentication, navigate, load])

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
