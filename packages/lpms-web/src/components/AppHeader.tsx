import { useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Header, Box, Text } from 'grommet';
import { Account } from './Account';
import { GlobalMenu } from '../Routes';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAppState } from '../store';
import { LogOutButton } from './LogOutButton';

export const AppHeader = () => {
  const { state } = useLocation();
  const { account } = useAppState();
  const pageTitle = usePageTitle();

  const returnLocation = useMemo(
    () => (state as any)?.location as Location,
    [state]
  );

  return (
    <Header
      pad='medium'
      direction='row'
    >
      {(returnLocation && account) &&
        <Navigate to={returnLocation} state={null} />
      }
      <Text size='large' weight='bold' color='brand'>
        {`LPMS: ${pageTitle}`}
      </Text>
      <Box
        direction='row'
        align='right'
        gap='small'
      >
        <Account />
        <LogOutButton />
        <GlobalMenu />
      </Box>
    </Header>
  );
};
