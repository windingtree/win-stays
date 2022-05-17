import { useAppDispatch, useAppState } from '../store';
import { Box, Button, ResponsiveContext, Spinner, Text } from 'grommet';
import { Logout } from 'grommet-icons';
import { useContext, useEffect } from 'react';
import { requests, useAuthRequest } from '../hooks/useAuthRequest';


export const LogOutButton = () => {
  const size = useContext(ResponsiveContext);
  const dispatch = useAppDispatch();
  const { authentication } = useAppState();
  const [send, response, loading,] = useAuthRequest(requests.logout);

  useEffect(() => {
    if (response !== undefined && response.status === 'success') {
      dispatch({
        type: 'SET_AUTHENTICATION_TOKEN',
        payload: {
          token: undefined,
          timestamp: 0
        }
      });
    }
  }, [response, dispatch])

  if (authentication.token === undefined) {
    return null;
  }

  return (
    <Button
      onClick={() => send()}
    >
      {() => (
        <Box direction='row' align='center'>
          {size !== 'small' &&
            <Text>
              Log out
            </Text>
          }
          {size === 'small' &&
            <Logout />
          }
          {loading && <Spinner />}
        </Box>
      )}
    </Button>
  )
};
