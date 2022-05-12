import { useAppState } from '../store';
import { StyledButton } from '.'
import { Box, Spinner, Text } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const { winWidth } = useWindowsDimension();
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
          {winWidth > 512 ?
            <Text>
              {isConnecting ? 'Connecting' : 'Connect'}
            </Text>
            :
            <Login />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </StyledButton>
  )
};

export const SignOutButton = () => {
  const { winWidth } = useWindowsDimension();
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
          {winWidth > 512 ?
            <Text>
              {isConnecting ? 'Connecting' : 'Disconnect'}
            </Text>
            :
            <Logout />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </StyledButton>
  )
};
