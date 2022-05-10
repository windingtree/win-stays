import { useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Image, Box } from 'grommet';
import { useAppState } from '../store';
import { Account } from './Account';
import { SignInButton, SignOutButton } from './Web3Modal';
import { Menu } from './Menu';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { account } = useAppState();

  const returnLocation = useMemo(
    () => (state as any)?.location as Location,
    [state]
  );

  return (
    <Box
      pad='medium'
      responsive={true}
      justify='between'
      align='center'
      direction='row'
    >
      {(returnLocation && account) &&
        <Navigate to={returnLocation} state={null} />
      }

      <Image
        src='/logo.svg'
        onClick={() => navigate('/')}
        style={{ height: '32px', cursor: 'pointer' }}
      />

      <Box direction='row' align='center' gap='small'>
        <Account account={account} />
        <Box>
          {account
            ? <SignOutButton />
            : <SignInButton />
          }
        </Box>
        <Menu />
      </Box>
    </Box>
  );
};
