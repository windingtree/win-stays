import { useAppState } from '../store';

export const SignInButton = () => {
  const { isConnecting, signIn, provider } = useAppState();

  if (!signIn || provider) {
    return null;
  }

  return (
    <button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting' : 'Connect'}
    </button>
  )
};

export const SignOutButton = () => {
  const { isConnecting, signOut, provider } = useAppState();

  if (!signOut || !provider) {
    return null;
  }

  return (
    <button
      onClick={() => signOut()}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting' : 'Disconnect'}
    </button>
  )
};
