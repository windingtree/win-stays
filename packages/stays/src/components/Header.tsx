import { SignInButton, SignOutButton } from './Web3Modal';
import { useAppState } from '../store';

export const Header = () => {
  const { account } = useAppState();

  return (
    <div>
      {account &&
        <div>
          {account}
        </div>
      }
      <SignInButton />
      <SignOutButton />
    </div>
  );
};
