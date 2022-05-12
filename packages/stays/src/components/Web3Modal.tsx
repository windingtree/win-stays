import { useAppState } from '../store';
import { StyledButton } from '.'
import { Box, ResponsiveContext, Spinner, Text } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import { useContext } from 'react';
import styled from 'styled-components';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signIn, provider } = useAppState();

  if (!signIn || provider) {
    return null;
  }

  return (
    <StyledButton
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Connect'}
            </Text>
          }
          {size === 'small' &&
            <Login />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </StyledButton>
  )
};

export const SignOutButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signOut, provider } = useAppState();

  if (!signOut || !provider) {
    return null;
  }

  return (
    <StyledButton
      onClick={() => signOut()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Disconnect'}
            </Text>
          }
          {size === 'small' &&
            <Logout />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </StyledButton>
  )
};
